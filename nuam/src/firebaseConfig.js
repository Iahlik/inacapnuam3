import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured() {
  return !!firebaseConfig.apiKey;
}

export function initFirebase() {
  if (!isFirebaseConfigured()) {
    console.warn("Firebase env variables not set. Skipping initialization.");
    return null;
  }

  const apps = getApps();
  const app = apps.length ? getApp() : initializeApp(firebaseConfig);

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export default firebaseConfig;
