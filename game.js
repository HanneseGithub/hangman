export default class Game {
  usedCharacters = [];
  correctCharacters = [];
  lives;
  wordToGuess;

  constructor() {
    // Assign the player 15 tries by default.
    this.lives = 15;
    this.wordToGuess = this.loadRandomWord();
  }

  // Call and save a random word from an API.
  async loadRandomWord() {
    let incomingData = await fetch("https://random-word.ryanrk.com/api/en/word/random")
    .then(function(response) {
      return response.json();
    })
    .then(json => {
      // Transform the word to lowercase letters only.
      this.wordToGuess = json[0].toLowerCase();
    })
  }

  // Create the gameboard.
  loadGameBoard() {
    // Clear the latest gameboard state.
    document.getElementById("gameboard").innerHTML = " ";

    // For each character in the word, print something to the gameboard.
    for(let i = 0; i < this.wordToGuess.length; i++) {
      // If the active character is inside correctCharacters[], use it instead of "_".
      if (this.correctCharacters.includes(this.wordToGuess[i])) {
        document.getElementById("gameboard").innerHTML += " " + this.wordToGuess[i] + " ";
      } else {
        document.getElementById("gameboard").innerHTML += " _ ";
      }
    }
  }

  // Handle user's input after clicking the guessing button.
  handleUserInput(e) {
    event.preventDefault();

    // Make sure the game doesn't continue after the player has won.
    if(!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("win").innerHTML = "You won!";
      return;
    }

    // Make sure the game doesn't continue after the player has lost.
    if (this.lives <= 0) {
      document.getElementById("lost").innerHTML = "You lost!";
      return;
    }

    // Reset error messages after every click.
    document.getElementById("error").innerHTML = "";

    // Save user's input.
    let userInput = document.getElementById("guess").value.toLowerCase();

    // Reset input field after every click.
    document.getElementById("guess").value = '';

    // Make sure, that user inputs only one character.
    if (userInput.length != 1) {
      document.getElementById("error").innerHTML = "You should only enter one character at a time!";
      return;
    }

    // Make sure, that user inputs a string.
    if(!isNaN(userInput)) {
      document.getElementById("error").innerHTML = "You should only enter string characters";
      return;
    }

    // Check, if the character has already been used.
    if (this.usedCharacters.includes(userInput.toUpperCase())) {
      document.getElementById("error").innerHTML = "This character has been used already!";
      document.getElementById("guessedResult").innerHTML = this.usedCharacters;
      return;
    }

    // Push a new character to usedCharacters.
    this.usedCharacters.push(userInput.toUpperCase());
    // Show guessed characters on the screen.
    document.getElementById("guessedResult").innerHTML = this.usedCharacters;

    // Check, if user's guess was wrong.
    if(!this.wordToGuess.includes(userInput)) {
      // If user guessed wrong, subtract one life and check if game is over or not.
      this.lives --;

      // If the lives hit 0, let user know that he lost.
      if (this.lives <= 0) {
        document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
        document.getElementById("lost").innerHTML = "You lost!";
        return;
      }

      // If there are enough lives left, let him know that the guess was wrong.
      document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
      document.getElementById("error").innerHTML = 'The character "' + userInput + '" is not in the word! You lost a life!'
      return;
    }

    // Save correctly guessed character to the array and
    this.correctCharacters.push(userInput);

    // Load the game board again with updated characters.
    this.loadGameBoard(this.wordToGuess);

    // If the string doesnt contain "_", player has won.
    if (!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("win").innerHTML = "You won!";
    }
  }
}