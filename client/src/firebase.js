// // src/firebaseStub.js
// // Temporary stubbed social auth functions to prevent runtime crashes.
// // Replace with your actual Firebase auth logic when ready.

// export async function signInWithGoogle() {
//   // As a placeholder, open Google's signin in a new tab.
//   // Real integration must use OAuth flow and redirect URIs.
//   window.open("https://accounts.google.com/signin", "_blank", "noopener");
//   return Promise.resolve();
// }

// export async function signInWithFacebook() {
//   window.open("https://www.facebook.com/login.php", "_blank", "noopener");
//   return Promise.resolve();
// }

// export async function signInWithApple() {
//   window.open("https://appleid.apple.com/auth/authorize", "_blank", "noopener");
//   return Promise.resolve();
// }

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const facebookProvider = new FacebookAuthProvider();

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithFacebook() {
  return signInWithPopup(auth, facebookProvider);
}

export async function signInWithApple() {
  return signInWithPopup(auth, appleProvider);
}

