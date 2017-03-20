function main(playButton, gameView, username) {
  playButton.addEventListener('click', function() {
    if (username === "") {
      alert('Oops! Captain can you please give us your id?');
    } else {
      startGame({
        viewElement: gameView
      });
    }
  });
}

function twoPlayer(playButton, gameView, username) {
  playButton.addEventListener('click', function() {

    if (username === "") {
      alert('Oops! Captain can you please give us your id?');
    } else {
      startGame({
        viewElement: gameView
      });
    }
  });
}

this.main(document.getElementById('btnPlay1'), document.getElementById('vwGame'), document.getElementById("username").value);
this.twoPlayer(document.getElementById('btnPlay2'), document.getElementById('vwGame'), document.getElementById("username").value);
