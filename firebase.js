// ================= FIREBASE IMPORTS =================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getAuth,

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  sendPasswordResetEmail,

  onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    doc,
    deleteDoc,
    updateDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= FIREBASE CONFIG =================

const firebaseConfig = {
  apiKey: "AIzaSyArpt5rt-zsn1xJf_M32CHstMh0zvN9S2c",
  authDomain: "jobquestai-b0cca.firebaseapp.com",
  projectId: "jobquestai-b0cca",
  storageBucket: "jobquestai-b0cca.firebasestorage.app",
  messagingSenderId: "521902381675",
  appId: "1:521902381675:web:8b98bb4252fd2a8f56af2e",
  measurementId: "G-XFVTZEFPF8"
};

// ================= INITIALIZE =================

const app =
initializeApp(firebaseConfig);

// ================= SERVICES =================

const auth =
getAuth(app);

const db =
getFirestore(app);

// ================= GLOBAL =================

window.auth = auth;

window.createUserWithEmailAndPassword =
createUserWithEmailAndPassword;

window.signInWithEmailAndPassword =
signInWithEmailAndPassword;

window.signOut =
signOut;

window.sendPasswordResetEmail =
sendPasswordResetEmail;

window.onAuthStateChanged =
onAuthStateChanged;

window.db = db;

window.collection = collection;

window.addDoc = addDoc;

window.getDocs = getDocs;

window.query = query;

window.orderBy = orderBy;
window.limit = limit;
window.setDoc = setDoc;
window.doc = doc;
window.deleteDoc = deleteDoc;
window.updateDoc = updateDoc;
window.where = where;
window.serverTimestamp =
serverTimestamp;



console.log(
  "Firebase Connected Successfully"
);

export {

  db,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
  updateDoc

};