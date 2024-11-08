// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6aH8tAX0uKIA-8nVpV0voH7Z1rm1ZTCA",
  authDomain: "todoforjsp.firebaseapp.com",
  databaseURL: "https://todoforjsp-default-rtdb.firebaseio.com",
  projectId: "todoforjsp",
  storageBucket: "todoforjsp.firebasestorage.app",
  messagingSenderId: "110488117205",
  appId: "1:110488117205:web:f4cdb399947edc9608e75c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
      Swal.fire({
        title: "Login Failed",
        text: "wrong",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); 
    login(); 
  });
