// Importing Firebase authentication module
import { auth } from "../login/login_registration.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


// Getting HTML elements
const reportsContainer = document.getElementById("reports-container");
const messageContainer = document.getElementById("message-container");

const db = getFirestore();

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (!messageContainer) return;

  if (user) {
    messageContainer.innerHTML = "";
    await fetchReports(user.uid); // Pass user ID to fetchReports
  } else {
    messageContainer.innerHTML = "<p>Sign in to view reports.</p>";
    reportsContainer.innerHTML = "";
  }
});

// Handle login/logout authentication button text and actions
onAuthStateChanged(auth, (user) => {
  const authButton = document.getElementById('authButton');
  if (user) {
    // User is signed in
    authButton.textContent = "Logout";
    authButton.onclick = () => {
      signOut(auth).then(() => {
        console.log("User signed out");
      }).catch((error) => {
        console.error("Error signing out:", error);
      });
    };
  } else {
    // User is not signed in
    authButton.textContent = "Login / Sign Up";
    authButton.onclick = () => {
      window.location.href = "./login/login_registration.html"; // Redirect to login page
    };
  }
});

// Fetch and display user reports from Firestore
async function fetchReports(userId) {
  if (!userId) {
    messageContainer.innerHTML = "Sign in to view reports.";
    return;
  }
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    if (userData.reports) {
      try {
        const reports = JSON.parse(userData.reports); // Convert JSON string to array

        if (reports.length > 0) {
          // Loop through reports and create report cards
          reports.forEach((report) => {
            const reportCard = document.createElement("div");
            reportCard.classList.add("report-card");

            reportCard.innerHTML = `
              <img src="${report.imageUrl}" alt="Report Image" class="report-image">
              <div class="report-details">
                <h3>${report.title}</h3>
                <p><strong>Address:</strong> ${report.address}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Severity:</strong> ${report.severity}</p>
                <p><strong>Duration:</strong> ${report.duration}</p>
                <p><strong>Comments:</strong> ${report.comments}</p>
                <p><strong>Reported on:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
              </div>
            `;
            reportsContainer.appendChild(reportCard);
          });
        } else {
          messageContainer.innerHTML = "<p>You have not made any reports.</p>";
        }
      } catch (error) {
        console.error("Error parsing reports:", error);
        reportsContainer.innerHTML = "<p>Error loading reports.</p>";
      }
    } else {
      reportsContainer.innerHTML = "<p>No reports found.</p>";
    }
  } else {
    reportsContainer.innerHTML = "<p>User does not exist.</p>";
  }
}

// Handling "Report an Issue" button click event
onAuthStateChanged(auth, async (user) => {
  const reportIssueBtn = document.getElementById('reportIssueBtn');
  reportIssueBtn.addEventListener("click", () => {
    if (user) {
      window.location.href = "../issues/issues.html"
    } else {
      messageContainer.innerHTML = "<p>Please Sign in to make a report.</p>";
      reportsContainer.innerHTML = "";
    }
  });
});

// Handle navigation menu toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

document.addEventListener("DOMContentLoaded", function () {

  function navMenu() {
    menuBtn.addEventListener("click", (e) => {
      navLinks.classList.toggle("open");

      const isOpen = navLinks.classList.contains("open");
      menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line")
    });

    navLinks.addEventListener("click", (e) => {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
    });
  }
  navMenu();
});


