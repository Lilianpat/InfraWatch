// Importing Firebase authentication module and required functions
import { auth } from "../login/login_registration.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Listen for authentication state changes when Get Started button is clicked
onAuthStateChanged(auth, (user) => {
  const authButton = document.getElementById('authButton');
  const getStartedBtn = document.getElementById('getStartedBtn');

  if (user) {
    getStartedBtn.href = "./reports/reports.html";
  } else {
    getStartedBtn.href = "./login/login_registration.html";
  }

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

// Handle navigation menu toggle
const menuBtn = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-link");
const menuBtnIcon = menuBtn.querySelector("i");

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


// Scroll Reveal Animations

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header_content h2", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".header_content h1", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".header_content p", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".header_content .header_btn", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".footer-content", {
  ...scrollRevealOption,
  delay: 2500,
});

ScrollReveal().reveal(".copyright", {
  ...scrollRevealOption,
  delay: 2500,
});