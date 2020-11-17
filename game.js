export default class Game {
  usedCharacters = [];
  correctCharacters = [];
  lives;
  wordToGuess;

  constructor() {
    this.lives = 15;
    this.wordToGuess = this.loadRandomWord();
  }

  // Generate a random word from a random word API
  async loadRandomWord() {
    let incomingData = await fetch("https://random-word.ryanrk.com/api/en/word/random")
    .then(function(response) {
      return response.json();
    })
    .then(json => {
      this.wordToGuess = json[0].toLowerCase();
    })
  }

  // Create the gameboard
  loadGameBoard() {
    document.getElementById("gameboard").innerHTML = " ";

    for(let i = 0; i < this.wordToGuess.length; i++) {
      // If there are characters inside correctCharacters, use them instead of "_".
      if (this.correctCharacters.includes(this.wordToGuess[i])) {
        document.getElementById("gameboard").innerHTML += " " + this.wordToGuess[i] + " ";
      } else {
        document.getElementById("gameboard").innerHTML += " _ ";
      }
    }
  }

  // Deal with user's input
  handleUserInput(e) {
    event.preventDefault();

    // Make sure the game doesn't go on after winning
    if(!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("win").innerHTML = "You won!";
      return;
    }

    // Make sure the game doesn't go on after losing
    if (this.lives <= 0) {
      document.getElementById("lost").innerHTML = "You lost!";
      return;
    }

    // Reset error message after every click
    document.getElementById("error").innerHTML = "";

    // Save user's guess
    let userInput = document.getElementById("guess").value.toLowerCase();

    // Reset user input after every click
    document.getElementById("guess").value = '';

    // Make sure, that user inputs only one character
    if (userInput.length != 1) {
      document.getElementById("error").innerHTML = "You should only enter one character at a time!";
      return;
    }

    // Make sure, that user inputs a string
    if(!isNaN(userInput)) {
    document.getElementById("error").innerHTML = "You should only enter string characters";
    return;
    }

    // Check, if user input has already been used
    if (this.usedCharacters.includes(userInput.toUpperCase())) {
      document.getElementById("error").innerHTML = "This character has been used already!";
      document.getElementById("guessedResult").innerHTML = this.usedCharacters;
      return;
    }

    // Push new character to usedCharacters
    this.usedCharacters.push(userInput.toUpperCase());
    document.getElementById("guessedResult").innerHTML = this.usedCharacters;

    // Check, if the input was wrong
    if(!this.wordToGuess.includes(userInput)) {
      this.lives --;
      if (this.lives <= 0) {
        document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
        document.getElementById("lost").innerHTML = "You lost!";
        return;
      }
      document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
      document.getElementById("error").innerHTML = 'The character "' + userInput + '" is not in the word! You lost a life!'
      return;
    }

    // Save correct character to the array and load the game board again, with updated characters.
    this.correctCharacters.push(userInput);
    this.loadGameBoard(this.wordToGuess);


    // If the string doesnt contain "_", win
    if (!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("win").innerHTML = "You won!";
    }
  }
}