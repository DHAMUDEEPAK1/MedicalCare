import { createActorWithConfig } from '../config';
import { saveToFirebase } from '../lib/firebase';
import { UserProfile } from '../backend';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Synchronizes a user profile between the ICP backend and Firebase.
 */
export async function syncUserProfile(profile: UserProfile) {
  try {
    // 1. Save to ICP Backend (Motoko)
    const actor = await createActorWithConfig();
    await actor.saveCallerUserProfile(profile);
    console.log("Profile saved to ICP backend");

    // 2. Save to Firebase (Firestore)
    const firebaseId = await saveToFirebase('user_profiles', {
      ...profile,
      dateOfBirth: profile.dateOfBirth ? Number(profile.dateOfBirth) : null,
      source: 'icp_sync'
    });
    console.log("Profile saved to Firebase with ID:", firebaseId);

    return { success: true, firebaseId };
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}

/**
 * Synchronizes medical report metadata to Firebase after it's uploaded to ICP.
 */
export async function syncReportMetadata(reportData: {
  id: string;
  filename: string;
  size: number;
  contentType?: string;
  uploadedAt: number;
  userId?: string;
}) {
  try {
    // Note: The file bytes are stored on ICP (Motoko/medicalcare Storage).
    // Here we sync the metadata to Firebase for easy querying and reporting.
    await setDoc(doc(db, 'medical_reports', reportData.id), {
      ...reportData,
      syncedAt: serverTimestamp(),
    });
    console.log("Report metadata synced to Firebase");
  } catch (error) {
    console.error("Report sync failed:", error);
    throw error;
  }
}

/**
 * Example function to sync a medical prediction
 */
export async function syncPrediction(prediction: any) {
  try {
    await saveToFirebase('predictions', {
      ...prediction,
      timestamp: Date.now()
    });
    console.log("Prediction synced to Firebase");
  } catch (error) {
    console.error("Prediction sync failed:", error);
  }
}
