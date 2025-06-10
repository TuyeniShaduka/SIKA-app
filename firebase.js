import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnRWUtOfaKNXumXg67zc5l08cf3fVsqvY",
  authDomain: "sika-app-64336.firebaseapp.com",
  projectId: "sika-app-64336",
  storageBucket: "sika-app-64336.firebasestorage.app",
  messagingSenderId: "94001270002",
  appId: "1:94001270002:web:d39741ac8c46b3beaf146b",
  measurementId: "G-MCWZ7V3MBL"
};

let firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app(); // if already initialized, use that one
}


const auth = firebaseApp.auth();
const db = firebaseApp.firestore();

export { auth, db };
