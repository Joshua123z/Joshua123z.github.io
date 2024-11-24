// Import Firebase modules (v9+ modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Global variable to track current user
let currentUser = null;

// Google Sign-In
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;
      console.log('User signed in:', currentUser);
      if (!currentUser.displayName) {
        let name = prompt("Choose a display name:");
        currentUser.updateProfile({
          displayName: name
        }).then(() => {
          console.log("Name set:", currentUser.displayName);
        });
      }
      loadMessages(); // Load messages after sign-in
    })
    .catch((error) => {
      console.error('Error during sign-in:', error.message);
    });
}

// Sign Out
function signOut() {
  signOut(auth).then(() => {
    currentUser = null;
    console.log("User signed out");
    loadMessages(); // Refresh messages after sign out
  });
}

// Load messages from Firebase Realtime Database
function loadMessages() {
  const messagesRef = ref(database, 'messages');
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.displayName}: ${message.message}`;
    document.getElementById('messages').appendChild(messageElement);
  });
}

// Listen to authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Authenticated user:', currentUser.displayName);
  } else {
    console.log('No user signed in');
  }
});
