import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

// Get user info elements
const userNameElement = document.getElementById("user-name");
const userEmailElement = document.getElementById("user-email");
const noEventsMessage = document.getElementById("no-events-message"); // Reference to the "No upcoming events" message
const eventsTbody = document.getElementById("events-tbody"); // Reference to the table body where events will be listed

// Handle user authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName;
    const email = user.email;
    userNameElement.textContent = displayName;
    userEmailElement.textContent = email;
  } else {
    signInWithGoogle();
  }
});

// Google Sign-In function
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      console.error("Error during sign-in: ", error.message);
    });
}

// Fetch events from Firestore
async function fetchEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    if (querySnapshot.empty) {
      // If no events are found
      noEventsMessage.style.display = "block";
    } else {
      let index = 0; // Initialize the serial number
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const eventId = doc.id;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${++index}</td>
          <td>${event.eventName}</td>
          <td>${event.date}</td>
          <td><a href="details.html?eventId=${eventId}">View Details</a></td>
          <td><a href="#" class="remove-link" data-id="${eventId}">Remove</a></td>
        `;
        eventsTbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching events: ", error);
  }
}

async function removeEvent(eventId) {
  try {
    // Remove event from Firestore
    await deleteDoc(doc(db, "events", eventId));
    // Remove associated budget from Firestore (assuming budgets are stored in a collection called "budgets")
    await deleteDoc(doc(db, "budgets", eventId));
    // Reload events
    eventsTbody.innerHTML = "";
    fetchEvents();
  } catch (error) {
    console.error("Error removing event: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchEvents();

  eventsTbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-link")) {
      e.preventDefault();
      const eventId = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to remove this event?")) {
        removeEvent(eventId);
      }
    }
  });
});