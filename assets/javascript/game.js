// VARS ======================================================================

// Elements
var fire = {
  div: $("<img>"),
  div2: $("<img>"),
  element: "fire",
  image: "assets/images/fire.jpg",
  id: "fireElement",
}

var water = {
  div: $("<img>"),
  div2: $("<img>"),
  element: "water",
  image: "assets/images/water.jpg",
  id: "waterElement",
}

var air = {
  div: $("<img>"),
  div2: $("<img>"),
  element: "air",
  image: "assets/images/air.jpg",
  id: "airElement",
}

var earth = {
  div: $("<img>"),
  div2: $("<img>"),
  element: "earth",
  image: "assets/images/earth.jpg",
  id: "earthElement",
}

// Players
var player1 = {
  name: "",
  wins: 0,
  losses: 0,
  choice: "",
}

var player2 = {
  name: "",
  wins: 0,
  losses: 0,
  choice: "",
}

var player1Log = false;
var player2Log = false;

var playerName;
var playerNumber = null;
var playerObject = null;

var reset;

// FIREBASE ===================================================================
var firebaseConfig = {
  apiKey: "AIzaSyDqyP_85IMsqL_2yDMSfPEm6zUq1TkwDJI",
  authDomain: "rps-multiplayer-48ef1.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-48ef1.firebaseio.com",
  projectId: "rps-multiplayer-48ef1",
  storageBucket: "",
  messagingSenderId: "110323682510",
  appId: "1:110323682510:web:ddbe995a275fd20e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var users = database.ref("/players");

var chat = database.ref("/chat");

var connectedRef = database.ref(".info/connected");

// Firebase Functions =========================================================

// If connection is lost
connectedRef.on("value", function(snap) {
  console.log("connectedRef ", playerObject, " ", playerNumber)
  if (!snap.val() && playerNumber) {
    database.ref("/players/" + playerNumber).remove();
    playerNumber = null;

    logInScreen();
  }
}, error);

// If chat message is sent
chat.on("child_added", function(childSnap) {
  console.log("chat child added")
  let chatObj = childSnap.val();
  let chatText = chatObj.text;
  let logChat = $("<li>").attr("id", childSnap.key);

  // Style messages based on sender
  if (chatObj.userID == "system") {
    logChat.addClass("system");
  }
  else if (chatObj.userID == playerNumber) {
    logChat.addClass("currentUser");
  }
  else {
    logChat.addClass("otherUser");
  }

  // Showing sender username with message
  if (chatObj.name) {
    chatText = "<strong>" + chatObj.name + ":</strong> " + chatText;
  }

  // Show chat message on both screens
  logChat.html(chatText);
  $("#chatLog").append(logChat)

  $(".chatDiv").animate({scrollTop: $(".chatDiv")[0].scrollHeight}, 1000);
}, error);

// When chat message is deleted, delete from page
chat.on("child_removed", function (childSnap) {
  console.log("chat child removed ", playerObject, " ", playerNumber)
  $("#" + childSnap.key). remove()
}, error);

// When player is added
users.on("child_added", function(childSnap) {
  console.log("users child added ", childSnap.key)
  window["player" + childSnap.key + "Log"] = true;
  window["player" + childSnap.key]  = childSnap.val()
  console.log("Childsnap val child_added: ", childSnap.val())
}, error);

// When player changes
users.on("child_changed", function(childSnap) {
  console.log("users child changed ", playerObject, "number: ", playerNumber, "Key: ", childSnap.key)
  console.log("Window: ", window["player" + childSnap.key])
  console.log("Childsnap val child_changed: ", childSnap.val())
  window["player" + childSnap.key]  = childSnap.val();
  updateStats();
}, error);

// When player leaves
users.on("child_removed", function(childSnap) {
  console.log("users child removed ", playerObject, " ", playerNumber)
  chat.push ({
    userID: "system",
    text: childSnap.val().name + " had disconnected"
  });

  window["player" + childSnap.key + "Log"] = false;
  window["player" + childSnap.key]  = {
    name: "",
    wins: 0,
    losses: 0,
    choice: "",
  }

  // If both players leave, clear the chat
  if (!player1Log && !player2Log) {
    chat.remove();
  }
}, error);

// When other changes are made with players
users.on("value", function(snap) {
  console.log("users value ", playerObject, " ", playerNumber)
  // Update player names
  $("#player1Name").text(player1.name || "Waiting for Player 1");
  $("#player2Name").text(player2.name || "Waiting for Player 2");

  turnsWaiting("1", snap.child("1").exists(), snap.child("1").exists() && snap.child("1").val().choice)
  turnsWaiting("2", snap.child("2").exists(), snap.child("2").exists() && snap.child("2").val().choice)

  if (player1Log && player2Log && !playerNumber) {
    loginPending();
  }
  else if (playerNumber) {
    loggedIn();
  }
  else {
    logInScreen();
  }

  if (player1.choice && player2.choice) {
    compare(player1.choice, player2.choice)
  }
}, error);

function error(errorObject) {
  console.log("Errors handled: " + errorObject.code);
}
// Function(s) ===============================================================

function submitName(event) {
  console.log("submitName ", playerObject, " ", playerNumber)
  event.preventDefault();

  if (!player1Log) {
    playerNumber = "1";
    playerObject = player1;
  }
  else if (!player2Log) {
    playerNumber = "2";
    playerObject = player2;
  }
  else {
    playerNumber = null;
    playerObject = null;
  }

  if (playerNumber) {
    playerName = $("#user").val().trim();
    playerObject.name = playerName;
    $("#user").val("");

    database.ref("/players/" + playerNumber).set(playerObject);
    database.ref("/players/" + playerNumber).onDisconnect().remove();
  }
}

// ! Hide elements and shows choice
function playGame() {
  console.log("playGame ", this, "", playerObject, " ", playerNumber)
  if (!playerNumber) return;

  playerObject.choice = this.id;
  console.log("Player Object: ", playerObject)

  database.ref("/players/" + playerNumber).set(playerObject);

  // Hide elements
  $("#player" + playerNumber + "Elements").hide();
  // Put choice into div and show
  $("#player" + playerNumber + "Choice").text(this.id).show();
}

function submitChat(event) {
  console.log("submitChat ", playerObject, " ", playerNumber)
  event.preventDefault();

  // If user types something, push to firebase 
  chat.push({
    userID: playerNumber,
    name: playerName,
    text: $("#chat").val().trim(),
  });

  $("#chat").val("")
}

// Compare choices and display feedback
function compare(p1choice, p2choice) {
  console.log("compare ", playerObject, " ", playerNumber)
  $("#player1Choice").text(p1choice);
  $("#player2Choice").text(p2choice);

  showSelection();

  if (p1choice == p2choice){
    $(".feedback").text("It's a Tie!");
  }
  else if ((p1choice == "Fire" && p2choice == "Earth") || (p1choice == "Earth" && p2choice == "Air") || (p1choice == "Air" && p2choice == "Fire") || (p1choice == "Air" && p2choice == "Water") || (p1choice == "Water" && p2choice == "Earth") || (p1choice == "Water" && p2choice == "Fire")) {
    $(".feedback").html("<small>" + p1choice + " beats " + p2choice + "</small><br/><br/>" + player1Object.name + " wins!");

    if (playerNumber == "1") {
      playerObject.wins++;
    }
    else {
      playerObject.losses++;
    }
  }
  else {
    $(".feedback").html("<small>" + p2choice + " beats " + p1choice + "</small><br/><br/>" + player2Object.name + " wins!");

    if (playerNumber == "2") {
      playerObject.wins++;
    }
    else {
      playerObject.losses++;
    }
  }

  reset = setTimeout(resetGame, 3000)
}

//! Sets choice to nothing
function resetGame() {
  console.log("resetGame ", playerObject, " ", playerNumber)
  clearTimeout(reset);

  playerObject.choice = "";

  database.ref("/players/" + playerNumber).set(playerObject);

  $(".choice").hide();
  $(".feedback").empty();
}


function updateStats() {
  console.log("updateStats ", playerObject, " ", playerNumber)

  ["1", "2"]. forEach(playerNum => {
      var obj = window["player" + playerNum];
      $("#player" + playerNum + "Wins").text(obj.wins);
      $("#player" + playerNum + "Losses").text(obj.losses);
    });

  player1Log ? $("#player1stats").show() : $("#player1stats").hide();
  player2Log ? $("#player2stats").show() : $("#player2stats").hide();
}

// ! Shows and hides thinking vs choice made
// Display if users have made their choices
function turnsWaiting(playerNum, exists, choice) {
  console.log("turnsWaiting ", playerObject, " ", playerNumber)
  if (exists) { //if the playerNum "1" or "2" exists in database
    if (playerNumber != playerNum) { //if the users number doesn't equal the playerNum
      if (choice) { 
        // Show player has made a choice
        $("#player" + playerNum + "Made").show();
        // Hide that player is thinking
        $("#player" + playerNum + "Pending").hide();
      }
      else if (!choice) {
        // Hide that player has made a choice
        $("#player" + playerNum + "Made").hide();
        // Show that player is thinking
        $("#player" + playerNum + "Pending").show();
      }
    }
  }
  else if (!exists) {
    $("#player" + playerNum + "Made").hide();
    $("#player" + playerNum + "Pending").hide();
  }
}

// Hides name input, chat box and elements
// Shows game full
function loginPending() {
  console.log("loginPending ", playerObject, " ", playerNumber)
  $(".playerInput").hide();
  $(".chatBox").hide();
  $(".elements").hide();
  $(".full").show();
};

// Hides game full, chat box and elements
// Shows name input
function logInScreen() {
  console.log("logInScreen ", playerObject, " ", playerNumber)
  $(".full").hide();
  $(".chatBox").hide();
  $(".elements").hide();
  $(".playerInput").show();
};

// Hides name input and game full
//! Shows chat box and elements based on user
function loggedIn() {
  console.log("loggedIn: ", playerObject, " ", playerNumber)
  $(".playerInput").hide();
  $(".full").hide();
  $(".chatBox").show();

  if (playerNumber == "1") {
    $("#player1Elements").show();
    console.log("Player One")
  }
  else {
    $("#player1Elements").hide();
  }

  if (playerNumber == "2") {
    $("#player2Elements").show();
    console.log("Player Two")
  }
  else {
    $("#player2Elements").hide();
  }
};

// Hides elements, if player is thinking and if player has made a selection
// Show what each player picked
function showSelection() {
  console.log("showSelection ", playerObject, " ", playerNumber)
  $(".elements").hide();
  $(".pending").hide();
  $(".selected").hide();
  $(".choice").show();
}

// Call ======================================
$(document).ready(function() {
  $("#submitPlayer").on("click", submitName);
  $("#submitChat").on("click", submitChat);
  $(".elementSelect").on("click", playGame)
})
