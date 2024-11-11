// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6aH8tAX0uKIA-8nVpV0voH7Z1rm1ZTCA",
  authDomain: "todoforjsp.firebaseapp.com",
  databaseURL: "https://todoforjsp-default-rtdb.firebaseio.com",
  projectId: "todoforjsp",
  storageBucket: "todoforjsp.appspot.com",
  messagingSenderId: "110488117205",
  appId: "1:110488117205:web:f4cdb399947edc9608e75c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var taskInput = document.getElementById("task");
var taskBox = document.getElementById("taskBox");
var taskCount = 0;
var database = firebase.database();

function addTask() {
  console.log("addTask called");

  if (taskCount >= 60) {
    alert("Max limit reached");
    return;
  }

  if (taskInput.value === "") {
    Swal.fire({
      title: "Note!",
      text: "Write something",
      icon: "warning",
    });
  } else {
    var task = {
      taskText: taskInput.value,
      completed: false, 
    };

    var user = firebase.auth().currentUser;
    if (user) {
      var userId = user.uid;
      var newTaskKey = database.ref("tasks/" + userId).push().key;
      database.ref("tasks/" + userId + "/" + newTaskKey).set(task);
      taskInput.value = "";
    }
  }
}

function loadTasks() {
  var user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    database.ref("tasks/" + userId).on("value", function (snapshot) {
      taskBox.innerHTML = ""; 
      snapshot.forEach(function (childSnapshot) {
        var taskData = childSnapshot.val();
        var taskId = childSnapshot.key; 
        createTaskElement(taskData.taskText, taskId);
      });
    });
  }
}

function createTaskElement(taskText, taskId) {
  var task = document.createElement("div");
  task.setAttribute("class", "task");
  task.setAttribute("id", taskId); 

  var taskContent = document.createElement("p");
  taskContent.textContent = taskText;
  task.appendChild(taskContent);

  var btnGroup = document.createElement("div");
  btnGroup.setAttribute("class", "task-btns");

  var editBtn = document.createElement("button");
  editBtn.setAttribute("class", "ri-edit-line");
  editBtn.setAttribute("onclick", "editTask(this)");
  btnGroup.appendChild(editBtn);

  var deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("onclick", "remove(this)");
  deleteBtn.setAttribute("class", "ri-close-line");
  btnGroup.appendChild(deleteBtn);

  task.appendChild(btnGroup);
  taskBox.appendChild(task);
  taskCount++;
}

function remove(btn) {
  var task = btn.parentNode.parentNode;
  var taskId = task.getAttribute("id"); 

  var user = firebase.auth().currentUser;
  if (user) {
    var userId = user.uid;
    database.ref("tasks/" + userId + "/" + taskId).remove();
  }

  task.remove();
  taskCount--;
}

function editTask(btn) {
  var btnParent = btn.parentNode;
  var taskText = btnParent.parentNode.firstChild;

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("maxlength", "50");
  input.setAttribute("placeholder", "Edit task");
  taskText.appendChild(input);
  input.value = taskText.textContent; 
  taskText.firstChild.textContent = ""; 
  btnParent.firstChild.style.display = "none"; 

  var saveBtn = document.createElement("button");
  saveBtn.setAttribute("class", "ri-save-line");
  saveBtn.setAttribute("onclick", "saveTask(this)");
  btnParent.prepend(saveBtn);
}

// Save Edited Task
function saveTask(btn) {
  var btnParent = btn.parentNode;
  var taskItem = btnParent.parentNode;
  var taskInput = taskItem.firstChild.firstChild.nextSibling;

  if (taskInput.value === "") {
    Swal.fire({
      title: "Note!",
      text: "Write something",
      icon: "warning",
    });
  } else {
    var taskId = taskItem.getAttribute("id");
    var user = firebase.auth().currentUser;
    if (user) {
      var userId = user.uid;
      database.ref("tasks/" + userId + "/" + taskId).update({
        taskText: taskInput.value,
      });

      taskItem.firstChild.innerHTML = taskInput.value; 
      btnParent.childNodes[1].style.display = "inline-block"; 
      btnParent.firstChild.remove(); 
    }
  }
}

function clearTasks() {
  taskBox.innerHTML = "";
  taskInput.value = "";
  taskCount = 0;

  var user = firebase.auth().currentUser;
  if (user) {
    var userId = user.uid;
    database.ref("tasks/" + userId).remove();
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    Swal.fire({
      title: "Welcome!",
      text: `Hello, ${user.email}`,
      icon: "success",
      confirmButtonText: "OK",
    });
    loadTasks();
  } else {
    window.location.href = "index.html"; 
  }
});

function logout() {
  Swal.fire({
    title: "Are you sure you want to logout?",
    text: "You will be logged out from the To-Do app.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      firebase.auth().signOut().then(() => {
        Swal.fire({
          title: "Goodbye!",
          text: "You have successfully logged out.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "index.html";
        });
      }).catch((error) => {
        Swal.fire({
          title: "Logout Failed",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
    }
  });
}
