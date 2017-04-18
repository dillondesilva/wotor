function main(gameView, welcomeView) {
  welcomeView.querySelector('#btnPlay1').addEventListener('click', function() {
    var username = welcomeView.querySelector('#username').value;
    if (username === "") {
      alert('Oops! Captain can you please give us your id?');
    } else {
      document.body.removeChild(welcomeView);
      campaign({
        viewElement: gameView
      });
    }
  });
}

function twoPlayer(gameView, welcomeView) {
  welcomeView.querySelector('#btnPlay2').addEventListener('click', function() {
    var username = welcomeView.querySelector('#username').value;
    if (username === "") {
      alert('Oops! Captain can you please give us your id?');
    } else {
      document.body.remove(welcomeView);
      startGame({
        viewElement: gameView
      });
    }
  });
}

this.main(
  document.getElementById('vwGame'),
  document.getElementById("vwWelcome"));

this.twoPlayer(
  document.getElementById('vwGame'),
  document.getElementById("vwWelcome"));
