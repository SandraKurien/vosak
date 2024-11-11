import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
      document.getElementById("event-venue").value = eventData.venue;
      document.getElementById("event-date").value = eventData.date;
      document.getElementById("event-duration").value = eventData.duration;
      document.getElementById("event-team-lead").value = eventData.teamLead;

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
          document.getElementById("budget-resources").value = budgetData.resources;
          document.getElementById("budget-venue").value = budgetData.venue;
          document.getElementById("budget-food").value = budgetData.food;
          document.getElementById("budget-equipment").value = budgetData.equipment;
          document.getElementById("budget-total").value = budgetData.total;
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

async function saveEventDetails(eventId) {
  try {
    // Get updated values from the input fields
    const updatedEventData = {
      venue: document.getElementById("event-venue").value,
      date: document.getElementById("event-date").value,
      duration: document.getElementById("event-duration").value,
      teamLead: document.getElementById("event-team-lead").value
    };

    // Update event document in Firestore
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, updatedEventData);

    const updatedBudgetData = {
      resources: document.getElementById("budget-resources").value,
      venue: document.getElementById("budget-venue").value,
      food: document.getElementById("budget-food").value,
      equipment: document.getElementById("budget-equipment").value,
      total: document.getElementById("budget-total").value
    };

    // Update budget document in Firestore
    const budgetQuery = query(
      collection(db, "budgets"),
      where("eventName", "==", updatedEventData.eventName)
    );

    const budgetQuerySnapshot = await getDocs(budgetQuery);

    if (!budgetQuerySnapshot.empty) {
      budgetQuerySnapshot.forEach(async (budgetDoc) => {
        const budgetRef = doc(db, "budgets", budgetDoc.id);
        await updateDoc(budgetRef, updatedBudgetData);
      });
    }

    alert("Event and Budget details updated successfully!");

  } catch (error) {
    console.error("Error updating event details:", error);
    alert("Event and Budget details updated successfully!");
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

  // Save changes when the Save Changes button is clicked
  document.getElementById("save-btn").addEventListener("click", () => {
    const eventId = getEventIdFromUrl();
    if (eventId) {
      saveEventDetails(eventId);
    } else {
      alert("No event ID found in URL.");
    }
  });
});

