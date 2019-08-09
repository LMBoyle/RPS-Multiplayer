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

// Function(s) ===============================

function userNames() {

  // TODO User types in name
  $("#submitOne").on("click", function(){
    console.log("you clicked one");
    var oneName = $("#userOne").val().trim();

    var userOne = {
      userOne: oneName
    }

    database.ref().push(userOne);
    $("#userOne").text(userOne)
  })


  // TODO Show game waiting screen
  // TODO Second user types in name
  $("#submitTwo").on("click", function(){
    console.log("you clicked two");
    var twoName = $("#userTwo").val().trim();

    var userTwo = {
      userTwo: twoName
    }

    database.ref().push(userTwo)
  })

  // Show selection screen
  playGame()

}

function playGame() {
  // TODO Show selection screen
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
