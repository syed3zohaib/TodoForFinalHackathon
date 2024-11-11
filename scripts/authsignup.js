// Firebase configuration (same as your previous setup)
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

function signUp() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    Swal.fire({
      title: "Password Mismatch",
      text: "The passwords do not match. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "signup.html"; 
    });
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      firebase.database().ref('tasks/' + user.uid).set({});
      
      Swal.fire({
        title: "Signup Successful!",
        text: "Welcome to the To-Do app!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "home.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Signup Failed!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html"; 
  }
});
