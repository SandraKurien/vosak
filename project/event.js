import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwN6QtAwmpwEeMVYcRY67sjJUtuDLDnhs",
  authDomain: "vosak-dd586.firebaseapp.com",
  projectId: "vosak-dd586",
  storageBucket: "vosak-dd586.appspot.com",
  messagingSenderId: "688820259475",
  appId: "1:688820259475:web:6eab282c6d3d2246cf5b66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const eventNameInput = document.getElementById("eventName");
const eventDateInput = document.getElementById("date");
const eventVenueInput = document.getElementById("venue");
const eventDurationInput = document.getElementById("duration");
const eventTeamLeadInput = document.getElementById("teamLead");
const addEventButton = document.querySelector(".submit-btn");
const errorMessageElement = document.getElementById("error-message");

// Add Event function
async function addEvent(eventName, eventDate, eventVenue, eventDuration, eventTeamLead) {
  try {
    // Check for conflicting events
    const conflictingEvents = await checkForConflictingEvents(eventDate, eventVenue);
    if (conflictingEvents) {
      // Display error message
      errorMessageElement.textContent = "An event with the same date and venue already exists.";
      errorMessageElement.style.display = "block";
      return; // Do not proceed with adding the event
    }

    // Add the new event to Firestore
    await addDoc(collection(db, "events"), {
      eventName: eventName,
      date: eventDate,
      venue: eventVenue,
      duration: eventDuration,
      teamLead: eventTeamLead
    });

    // Clear the error message
    errorMessageElement.textContent = "";
    errorMessageElement.style.display = "none";

    // Optionally, clear input fields after successful addition
    eventNameInput.value = "";
    eventDateInput.value = "";
    eventVenueInput.value = "";
    eventDurationInput.value = "";
    eventTeamLeadInput.value = "";

    // Optionally, display success message or redirect to another page
    alert("Event added successfully!");
    window.location.href="upcoming.html";

  } catch (error) {
    console.error("Error adding event: ", error);
  }
}

// Function to check for conflicting events
async function checkForConflictingEvents(eventDate, eventVenue) {
  const q = query(collection(db, "events"), where("date", "==", eventDate), where("venue", "==", eventVenue));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // Return true if there are conflicting events
}

// Form submission handler
document.getElementById("eventForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const eventName = eventNameInput.value.trim();
  const eventDate = eventDateInput.value.trim();
  const eventVenue = eventVenueInput.value.trim();
  const eventDuration = eventDurationInput.value.trim();
  const eventTeamLead = eventTeamLeadInput.value.trim();

  // Validate all fields are filled
  if (eventName && eventDate && eventVenue && eventDuration && eventTeamLead) {
    await addEvent(eventName, eventDate, eventVenue, eventDuration, eventTeamLead);
  } else {
    errorMessageElement.textContent = "Please fill in all the fields.";
    errorMessageElement.style.display = "block";
  }
});

