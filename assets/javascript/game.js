// VARS ======================================
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

var fire = {
  element: "fire",
  image: "assets/images/fire.jpg",
  id: "fireElement",
}

var water = {
  element: "water",
  image: "assets/images/water.jpg",
  id: "waterElement",
}

var air = {
  element: "air",
  image: "assets/images/air.jpg",
  id: "airElement",
}

var earth = {
  element: "earth",
  image: "assets/images/earth.jpg",
  id: "earthElement",
}

var playerOne = "";
var playerTwo = "";


// Function(s) ===============================
database.ref().on("value", function(snap){

})


function userNames() {
  if (playerOne === "" && playerTwo === "") {
    console.log("Both empty")
    // First user types in name
    $("#submitOne").on("click", function(){
      console.log("you clicked one");
      // Get the name from the first text box
      var oneName = $("#userOne").val().trim();
      // Show the name on the screen
      $(".oneName").text(oneName)
      // Show that user is waiting for another player
      $(".oneWaiting").text("Waiting for Player Two");
      playerOne = oneName;
      userNames();
    })
  }
  else if (playerOne != "" && playerTwo === "") {
    console.log("Player Two empty")
    // Second user types in name
    $("#submitTwo").on("click", function(){
      console.log("you clicked two");
      var twoName = $("#userTwo").val().trim();
      playerTwo = twoName;
      $(".twoName").text(twoName);
      userNames();
    })
  }
  else if (playerOne !== "" && playerTwo !== "") {
    playGame();
  }
}

function playGame() {
  $(".oneWaiting").empty();
  // TODO Show selection screen
  var img = $("<img>");
  img.attr("src", fire.img);

  $(".oneElements").append(img)
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
userNames()
