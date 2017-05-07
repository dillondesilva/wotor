// Our uid stored in localStorage and our access to the database
var uid = localStorage.getItem("uid");
var database = firebase.database().ref("/wotor");

// These are the arrays in which random usernames will be genarted from
var foodArray = ["Melon", "Walnut", "Pumpkin", "Potato", "Cheese", "Berry", "Bacon", "Chicken", "Pear", "Brocolli", "Tomato", "Banana"];
var adjectiveArray = ["Smelly", "Happy", "Cranky", "Pretty", "Crispy", "Chewy", "Shy", "Rotten", "Buttery", "Hot", "Fat", "Spooky"];

// Check if the client has a registered uid in their localStorage. If they don't the function
// generateUsername will be called and the console displays a message. Otherwise the console will
// output a welcome message
if (uid === null) {
  console.log("This user does not have a registered uid. Beginning generation process");
  this.generateUsername();
} else {
  var username = "default";

  database.child(uid).child("username").once("value", function(snapshot) {
    username = snapshot.val();
    console.log("Welcome back, " + username);
  });
}

// This function will generate a random username consisting of an adjective and a food
function generateUsername () {
  // The two variables which both get a random item from the array
  var wordOne = adjectiveArray[Math.floor(Math.random() * 11, 0)];
  var wordTwo = foodArray[Math.floor(Math.random() * 11, 0)];

  // The variable that will hold the concatenated result of the above two variables combined
  var finalCode = wordOne + wordTwo;

  // Log this to the console
  console.log(finalCode);
  // And pass the final username as a parameter to the confirmUsername function
  this.confirmUsername(finalCode);
}

// This function will take the random username and check if it already exists in the database
function confirmUsername (finalCode) {
  // Get a snapshot of the database
  database.once("value").then(function(snapshot) {
    // matchFound will a flag to whether the username already exists or not
    var matchFound = false;
    // We will iterate over each item in the data snapshot and find out whether the child nodes
    // username value is equal to our username. If this is the case the generateUsername function will
    // be called again to get a different username.
    snapshot.forEach( function (item) {
      if(item.child("username").val() === finalCode) {
        this.generateUsername();
        matchFound = true;
      }
    });
    // If there is no match between any username in the database and our generated one, we call
    // the pushToDatabase function
    if (matchFound !== true) {
      this.pushToDatabase(finalCode);
    }
  });
}

// This function simply takes in our generated username and pushes it to the database
function pushToDatabase (finalCode) {
// Push the username to the database with a random key
    database.push({
      username: finalCode
    });

// Here, we will find the key of the username that we just pushed and save that to localStorage. We will also
// change the variable uid to the key of the username so that when uid is referenced in other files, it will go
// down the correct path not null
  database.once("value").then(function(snapshot) {
      snapshot.forEach( function (item) {
        if(item.child("username").val() === finalCode) {
          localStorage.setItem("uid", item.key);
          uid = item.key;
        }
      });
    });
}
