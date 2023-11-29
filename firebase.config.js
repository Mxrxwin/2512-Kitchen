// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCW60UckUBppwr8ppniQjhV3bYEgFj0Qp4",
  authDomain: "fir-kitchen-39a69.firebaseapp.com",
  projectId: "fir-kitchen-39a69",
  storageBucket: "fir-kitchen-39a69.appspot.com",
  messagingSenderId: "698781199169",
  appId: "1:698781199169:web:1ce7c824b10d6fbe4d8fc0",
  measurementId: "G-K9VGSRCLXP"
};


// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
