// Demo mode - for demonstration purposes without actual Firebase setup
export const isDemoMode = true;

// Firebase configuration (only used when not in demo mode)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "demo-sender-id",
  appId: "demo-app-id"
};

// Initialize Firebase only if not in demo mode
let app, db;

if (!isDemoMode) {
  try {
    const { initializeApp } = require('@firebase/app');
    const { getFirestore } = require('@firebase/firestore');
    
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { db };
export default app; 