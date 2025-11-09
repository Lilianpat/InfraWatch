// Importing Firebase authentication module and required functions
import { auth } from "../login/login_registration.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";


// Get all input fields for form animations
const inputs = document.querySelectorAll('.input');

// Function to handle focus effect on input fields
function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

// Function to remove focus effect when input is empty
function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

// Add event listeners to input fields for focus and blur effects
inputs.forEach(input => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

// Handle navigation menu toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line")
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// Listen for authentication state changes and update login/logout button accordingly
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
      window.location.href = "./login/login_registration.html";
    };
  }
});

// Wait for the DOM to fully load before executing form submission logic
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector("form"); // Select the form

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Display popup message
      alert("Your message has been received! We will get back to you shortly.");

      // Wait 2 seconds and redirect
      setTimeout(() => {
        window.location.href = "../home.html"; // Redirect to home page
      }, 2000);
      this.submit();
    });
  }
});



