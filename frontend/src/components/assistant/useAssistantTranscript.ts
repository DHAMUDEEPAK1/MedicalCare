import { useState, useEffect, useCallback } from 'react';
import { AssistantMessage } from './assistantTypes';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';

const GUEST_TRANSCRIPT_KEY = 'healthcare_guest_transcript';

export function useAssistantTranscript() {
  const [firebaseTranscript, setFirebaseTranscript] = useState<AssistantMessage[]>([]);

  // Initialize localTranscript from sessionStorage for guests
  const [localTranscript, setLocalTranscript] = useState<AssistantMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem(GUEST_TRANSCRIPT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep sessionStorage in sync with localTranscript for guests across different hook instances
  useEffect(() => {
    sessionStorage.setItem(GUEST_TRANSCRIPT_KEY, JSON.stringify(localTranscript));
  }, [localTranscript]);

  // Sync state if another tab or component updates sessionStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GUEST_TRANSCRIPT_KEY && !auth.currentUser) {
        try {
          const stored = e.newValue ? JSON.parse(e.newValue) : [];
          setLocalTranscript(stored);
        } catch { }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Subscribe to real-time chat updates from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFirebaseTranscript([]);
      return;
    }

    const q = query(
      collection(db, 'chat_history'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        let timestamp = Date.now();
        if (data.timestamp) {
          if (typeof data.timestamp.toMillis === 'function') {
            timestamp = data.timestamp.toMillis();
          } else if (typeof data.timestamp === 'number') {
            timestamp = data.timestamp;
          }
        }

        return {
          id: doc.id,
          ...data,
          timestamp
        };
      }) as AssistantMessage[];

      const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
      setFirebaseTranscript(sortedMessages);
    }, (error) => {
      console.error("Firebase Snapshot Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string, confidence?: any, summary?: string) => {
    const user = auth.currentUser;
    const newMessage: AssistantMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      confidence: confidence || undefined,
      summary: summary || undefined,
      timestamp: Date.now(),
    };

    if (!user) {
      // Guest mode fallback - update local transcript and manually trigger storage event equivalent for sibling components
      setLocalTranscript(prev => {
        const next = [...prev, newMessage];
        sessionStorage.setItem(GUEST_TRANSCRIPT_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('storage')); // Broadcast to other hook instances
        return next;
      });
      return;
    }

    try {
      await addDoc(collection(db, 'chat_history'), {
        userId: user.uid,
        role,
        content,
        confidence: confidence || null,
        summary: summary || null,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving message to Firebase:", error);
      // Fallback to local on error
      setLocalTranscript(prev => {
        const next = [...prev, newMessage];
        sessionStorage.setItem(GUEST_TRANSCRIPT_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('storage'));
        return next;
      });
    }
  }, []);

  const clearTranscript = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Query and delete all chat history documents for this user
        const q = query(collection(db, 'chat_history'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error clearing transcript from Firebase:", error);
      }
    }
    setFirebaseTranscript([]);
    setLocalTranscript([]);
    sessionStorage.removeItem(GUEST_TRANSCRIPT_KEY);
    window.dispatchEvent(new Event('storage'));
  }, []);

  // For initial custom dispatch catch
  useEffect(() => {
    const handleCustomStorage = () => {
      if (!auth.currentUser) {
        try {
          const stored = sessionStorage.getItem(GUEST_TRANSCRIPT_KEY);
          setLocalTranscript(stored ? JSON.parse(stored) : []);
        } catch { }
      }
    };
    window.addEventListener('storage', handleCustomStorage);
    return () => window.removeEventListener('storage', handleCustomStorage);
  }, []);


  return {
    transcript: auth.currentUser ? firebaseTranscript : localTranscript,
    addMessage,
    clearTranscript,
    toggleMessageExpanded: (id: string) => { }
  };
}
