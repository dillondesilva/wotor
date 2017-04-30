// A simple while loop to just update the score in the database every 20 seconds while the game is still running
while (death !== true) {
  setInterval(function () {
    database.child(uid).update({
      score: score
    });
  }, 20000);
}
