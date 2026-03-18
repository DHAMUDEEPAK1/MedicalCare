import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxPvQoOC8JXb7VBp0q3h4ta9ep7OrJvdc",
  authDomain: "medicalcare-1721.firebaseapp.com",
  projectId: "medicalcare-1721",
  storageBucket: "medicalcare-1721.firebasestorage.app",
  messagingSenderId: "820880184698",
  appId: "1:820880184698:web:e7d129451beb973e54b2c3" // This matches the web app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Saves arbitrary data to a specified Firestore collection.
 * @param collectionName The name of the collection (e.g., 'users', 'records')
 * @param data The object to save
 */
export async function saveToFirebase(collectionName: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
