// VARS ======================================
var elements = {
  fire: {
    div: $("<img>"),
    div2: $("<img>"),
    element: "fire",
    image: "assets/images/fire.jpg",
    id: "fireElement",
  },
  water: {
    div: $("<img>"),
    div2: $("<img>"),
    element: "water",
    image: "assets/images/water.jpg",
    id: "waterElement",
  },
  air: {
    div: $("<img>"),
    div2: $("<img>"),
    element: "air",
    image: "assets/images/air.jpg",
    id: "airElement",
  },
  earth: {
    div: $("<img>"),
    div2: $("<img>"),
    element: "earth",
    image: "assets/images/earth.jpg",
    id: "earthElement",
  },
}

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


// FIREBASE ==================================
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

// Firbase Functions =========================

// When player is added
users.on("child_added", function(childSnap) {
  console.log("player " + childSnap.key +  " added")
  window["player" + childSnap.key + "Log"] = true;
  window["player" + childSnap.key]  = childSnap.val()
})

// When player changes
users.on("child_changed", function(childSnap) {
  window["player" + childSnap.key]  = childSnap.val();
  updateStats(); //TODO
})

// When player leaves
users.on("child_removed", function(childSnap) {
  window["player" + childSnap.key + "Log"] = false;
  window["player" + childSnap.key]  = {
    name: "",
    wins: 0,
    losses: 0,
    choice: "",
  }
})


// Function(s) ===============================

// * =========================================================================
function submitName(event) {
  event.preventDefault();
  console.log("Event: ", event);

  if (!player1Log) {
    playerNumber = "1";
    console.log('playerNumber1:', playerNumber)
    playerObject = player1;
    console.log('playerObject1:', playerObject)
  }
  else if (!player2Log) {
    playerNumber = "2";
    console.log('playerNumber2:', playerNumber)
    playerObject = player2;
    console.log('playerObject2:', playerObject)
  }
  else {
    playerNumber = null;
    playerObject = null;
  }

  if (playerNumber) {
    playerName = $("#user").val().trim();;
    playerObject.name = playerName;
    $("#user").val("");

    $("#playerWaiting").toggle();
    $("#playerName").toggle();
    $("#playerName").text("Player: " + playerName);

    database.ref("/players/" + playerNumber).set(playerObject);
    database.ref("/players/" + playerNumber).onDisconnect().remove();
  }
}



// * ===========================================================================================
function playGame() {
  $(".oneWaiting").empty();
  // Show selection screen

// If user is one, don't let click
  // TODO User 1 makes selection
  // TODO User 2 makes selection
  // TODO Push selections to firebase

}

function scoring() {
  // TODO Show each users selection
  // TODO Show which user won
  // TODO Update win and loss
}

function chat() {
  // TODO Show chat
  // TODO If user types something, push to firebase 
  // TODO Show chat message on both screens
}

// Call ======================================
$(document).ready(function() {
  $("#submitPlayer").on("click", submitName)
})
