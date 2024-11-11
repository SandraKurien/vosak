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

// Select the contact form
const contactForm = document.getElementById('contactForm');

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  try {
    // Add a new document to the Firestore collection
    await addDoc(collection(db, 'contacts'), {
      name: name,
      email: email,
      message: message,
      timestamp: new Date()
    });

    alert('Message sent successfully!');
    contactForm.reset(); // Reset the form after submission
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error sending message. Please try again.');
  }
});
