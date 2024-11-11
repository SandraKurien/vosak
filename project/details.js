import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

function getEventIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("eventId");
}

async function fetchEventDetails(eventId) {
  try {
    // Fetch event document using eventId
    const eventDocRef = doc(db, "events", eventId);
    const eventDocSnap = await getDoc(eventDocRef);

    if (eventDocSnap.exists()) {
      const eventData = eventDocSnap.data();
      
      // Set event details
      document.getElementById("event-name").textContent = eventData.eventName;
      document.getElementById("event-venue").textContent = eventData.venue;
      document.getElementById("event-date").textContent = eventData.date;
      document.getElementById("event-duration").textContent = eventData.duration;
      document.getElementById("event-team-lead").textContent = eventData.teamLead;

      // Now fetch the budget details based on the event name
      const budgetQuery = query(
        collection(db, "budgets"),
        where("eventName", "==", eventData.eventName) // Fetch budget details with the matching eventName
      );

      const budgetQuerySnapshot = await getDocs(budgetQuery);
      
      if (!budgetQuerySnapshot.empty) {
        budgetQuerySnapshot.forEach((budgetDoc) => {
          const budgetData = budgetDoc.data();

          // Set budget details
          document.getElementById("budget-resources").textContent = budgetData.resources;
          document.getElementById("budget-venue").textContent = budgetData.venue;
          document.getElementById("budget-food").textContent = budgetData.food;
          document.getElementById("budget-equipment").textContent = budgetData.equipment;
          document.getElementById("budget-total").textContent = budgetData.total;
        });
      } else {
        console.log("No budget data found for this event.");
        alert("No budget data found for this event.");
      }

    } else {
      alert("No such event found.");
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    alert("Error fetching event details. Please try again.");
  }
}

// Fetch and display event details when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const eventId = getEventIdFromUrl();
  if (eventId) {
    fetchEventDetails(eventId);
  } else {
    alert("No event ID found in URL.");
  }
});
