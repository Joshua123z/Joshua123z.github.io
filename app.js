// Import Firebase modules (v9+ modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase config (your provided config)
const firebaseConfig = {
  apiKey: "AIzaSyD3ZvLmJXK0jsSXTYjqLTPlu9dHG3a3bjs",
  authDomain: "bonk-bros-chat.firebaseapp.com",
  databaseURL: "https://bonk-bros-chat-default-rtdb.firebaseio.com",
  projectId: "bonk-bros-chat",
  storageBucket: "bonk-bros-chat.firebasestorage.app",
  messagingSenderId: "286528808357",
  appId: "1:286528808357:web:4cc24a23774b377915744c",
  measurementId: "G-703FQN4WS4"
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
      toggleAuthUI();
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
    loadMessages(); // Refresh messages after sign-out
    toggleAuthUI();
  });
}

// Toggle UI visibility based on authentication state
function toggleAuthUI() {
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  if (currentUser) {
    signInBtn.style.display = 'none';
    signOutBtn.style.display = 'inline-block';
  } else {
    signInBtn.style.display = 'inline-block';
    signOutBtn.style.display = 'none';
  }
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

// Send a message to Firebase
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value;
  if (messageText && currentUser) {
    const messagesRef = ref(database, 'messages');
    push(messagesRef, {
      message: messageText,
      timestamp: Date.now(),
      uid: currentUser.uid,
      displayName: currentUser.displayName
    });
    messageInput.value = ''; // Clear input field
  }
}

// Listen to authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Authenticated user:', currentUser.displayName);
  } else {
    console.log('No user signed in');
    currentUser = null;
  }
  toggleAuthUI();
});

