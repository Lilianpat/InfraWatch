// Importing Firebase authentication module
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Initialize Firebase Authentication 
const firebaseConfig = {
  apiKey: "AIzaSyCMppXh0vYWSjYrLOIRDdqkG6A-HGLoTBY",
  authDomain: "infrawatch-4788c.firebaseapp.com",
  projectId: "infrawatch-4788c",
  storageBucket: "infrawatch-4788c.appspot.com",
  messagingSenderId: "137734274611",
  appId: "1:137734274611:web:6cbe68ac1f1b92694f2d46",
  measurementId: "G-29LNGG5Y27"
};

// Initialize Firebase app and authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase
const firestoreApp = initializeApp(firebaseConfig, "firestoreApp");

let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in (issues):", user);
    currentUser = user;
  } else {
    console.log("No user signed in.");
    currentUser = null;
  }
});

// Handle issue report form submission
document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  // Get the currently signed-in user
  const userId = currentUser?.uid;
  if (!userId) {
    alert("You need to be signed in to submit a report.");
    window.location.href = "../login/login_registration.html";
    return;
  }

  // Get form values
  const address = document.getElementById("address").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const severity = document.querySelector('input[name="severity"]:checked').value;
  const duration = document.getElementById("duration").value;
  const comments = document.getElementById("comments").value;
  const imageInput = document.getElementById("images");

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfzxkwpku/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "InfraWatch";

  // Upload image to Cloudinary
  let imageUrl = "";
  if (imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      imageUrl = data.secure_url; // Cloudinary image URL
      console.log("Image Uploaded to Cloudinary >>> " + imageUrl)
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Error uploading image.");
      return;
    }
  }

  // Store report in Firestore
  try {
    const report = {
      address,
      title,
      description,
      severity,
      duration,
      comments,
      imageUrl,
      timestamp: new Date(),
    };
    const db = getFirestore();

    const docRef = doc(db, "users", userId);

    const userSnap = await getDoc(docRef);


    if (userSnap.exists()) {
      // Retrieve and update previous reports
      const { reports } = userSnap.data();
      const previousReports = JSON.parse(reports);
      previousReports.push(report);
      const newReports = JSON.stringify(previousReports);

      await setDoc(docRef, {
        ...userSnap.data(),
        reports: newReports
      });

      alert("Issue reported successfully!");
      window.location.href = "../reports/reports.html";
    } else {
      console.log("User does not exist!");
    }

  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error submitting report.");
  }
});

// Handle navigation menu toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
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
