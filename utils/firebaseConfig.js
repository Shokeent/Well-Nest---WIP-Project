import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuPvpn1VeawVZc8nNXH6_fBhqBs8L9HOI",
  authDomain: "wellnest-d1308.firebaseapp.com",
  projectId: "wellnest-d1308",
  storageBucket: "wellnest-d1308.firebasestorage.app",
  messagingSenderId: "33250647818",
  appId: "1:33250647818:web:bf4af39ae1057df597a4f3",
  measurementId: "G-V6RTWJCVG6"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
