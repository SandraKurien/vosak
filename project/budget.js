// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwN6QtAwmpwEeMVYcRY67sjJUtuDLDnhs",
  authDomain: "vosak-dd586.firebaseapp.com",
  projectId: "vosak-dd586",
  storageBucket: "vosak-dd586.firebasestorage.app",
  messagingSenderId: "688820259475",
  appId: "1:688820259475:web:6eab282c6d3d2246cf5b66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select the budget form
const budgetForm = document.querySelector('form');

// Handle form submission
budgetForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Collect the form data
  const eventName = document.getElementById('event-name').value;
  const resources = parseFloat(document.getElementById('resources').value);
  const venue = parseFloat(document.getElementById('venue').value);
  const food = parseFloat(document.getElementById('food').value);
  const equipment = parseFloat(document.getElementById('equipment').value);
  
  // Calculate the total automatically
  const total = resources + venue + food + equipment;

  try {
    // Log the data being sent to Firestore (for debugging)
    console.log("Adding data to Firestore:", {
      eventName,
      resources,
      venue,
      food,
      equipment,
      total
    });

    // Add a new document to the Firestore collection
    const docRef = await addDoc(collection(db, 'budgets'), {
      eventName: eventName,
      resources: resources,
      venue: venue,
      food: food,
      equipment: equipment,
      total: total,
      timestamp: new Date()
    });

    // Success
    console.log("Document written with ID: ", docRef.id);
    alert('Budget added successfully!');
    window.location.href = "upcoming.html"; // Redirect to upcoming.html
    budgetForm.reset(); // Reset the form after submission
  } catch (error) {
    // Log error if something goes wrong
    console.error('Error adding document: ', error);
    alert('Error adding budget. Please try again.');
  }
});

// Update the total field when any input changes (if you want it to be dynamically updated)
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    const resources = parseFloat(document.getElementById('resources').value) || 0;
    const venue = parseFloat(document.getElementById('venue').value) || 0;
    const food = parseFloat(document.getElementById('food').value) || 0;
    const equipment = parseFloat(document.getElementById('equipment').value) || 0;
    const total = resources + venue + food + equipment;
    // You can log or display total here, but no need for an input field for total.
    console.log("Total calculated: ", total);
  });
});
