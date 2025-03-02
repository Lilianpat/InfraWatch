// Importing Firebase authentication module
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


// Firebase configuration settings
const firebaseConfig = {
  apiKey: "AIzaSyCMppXh0vYWSjYrLOIRDdqkG6A-HGLoTBY",
  authDomain: "infrawatch-4788c.firebaseapp.com",
  projectId: "infrawatch-4788c",
  storageBucket: "infrawatch-4788c.appspot.com",
  messagingSenderId: "137734274611",
  appId: "1:137734274611:web:6cbe68ac1f1b92694f2d46",
  measurementId: "G-29LNGG5Y27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Set authentication language
auth.languageCode = 'en'
const provider = new GoogleAuthProvider();

// Select HTML DOM elements for toggling between login and registration forms
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Event listeners
if (registerBtn && loginBtn) {
  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
}

// Function to display messages to the user
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Handle user sign-up
const signUp = document.getElementById('submitSignUp');
if (signUp) {
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const username = document.getElementById('rUsername').value;

    if (!email || !password) {
      showMessage('Email and Password are required!', 'signUpMessage');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          username: username,
          reports: "[]"
        };
        showMessage('Account Created Successfully', 'signUpMessage');

        // Save user data in Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            window.location.href = 'login_registration.html';
          })
          .catch((error) => {
            console.error("error writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
          showMessage('Email Adress Already Exists !!!', 'signUpMessage');
        }
        else {
          showMessage('Unable to create User', 'signUpMessage');
        }
      })
  });
}

// Handle user sign-in
const signIn = document.getElementById('submitSignIn');

if (signIn) {
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('login is successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = '../home.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
          showMessage('Account does not Exist', 'signInMessage')
        }
      })
  })
}

// Handle password reset
const forgotPassword = document.getElementById('forgotPassword');
function ForgotPassword() {
  const email = document.getElementById('email').value;
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("A Password reset link has been sent to your email");
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    })
}
if (forgotPassword) {
  forgotPassword.addEventListener('click', ForgotPassword);
}

// Handle Google authentication
const googleLogin = document.getElementById('googleLoginBtn');
if (googleLogin) {
  googleLogin.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = '../home.html';
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  })
}
