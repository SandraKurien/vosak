// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwN6QtAwmpwEeMVYcRY67sjJUtuDLDnhs",
  authDomain: "vosak-dd586.firebaseapp.com",
  projectId: "vosak-dd586",
  storageBucket: "vosak-dd586.appspot.com",
  messagingSenderId: "688820259475",
  appId: "1:688820259475:web:d8e7aa0cbe5c97ffcf5b66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select the event form
const eventForm = document.getElementById('eventForm');

// Handle form submission
eventForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission

  const eventName = document.getElementById('eventName').value;
  const venue = document.getElementById('venue').value;
  const date = document.getElementById('date').value;
  const duration = document.getElementById('duration').value;
  const teamLead = document.getElementById('teamLead').value;

  try {
    // Add a new document to the Firestore collection
    await addDoc(collection(db, 'events'), {
      eventName: eventName,
      venue: venue,
      date: date,
      duration: duration,
      teamLead: teamLead,
      timestamp: new Date()
    });
    
    window.location.href="upcoming.html"
    eventForm.reset(); // Reset the form after submission
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding event. Please try again.');
  }
});
