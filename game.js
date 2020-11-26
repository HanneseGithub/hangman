export default class Game {
  usedCharacters = [];
  correctCharacters = [];
  lives;
  wordToGuess;

  constructor() {
    // Assigns the player 15 tries by default.
    this.lives = 15;
    this.wordToGuess = this.loadRandomWord();
  }

  // Returns a random word from API.
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

  // Creates the gameboard.
  loadGameBoard() {

    // Clears the latest gameboard state.
    document.getElementById("gameboard").innerHTML = " ";

    // For each character in the word, prints something to the gameboard.
    for(let i = 0; i < this.wordToGuess.length; i++) {

      // If the active character is inside correctCharacters[], uses it instead of "_".
      if (this.correctCharacters.includes(this.wordToGuess[i])) {
        document.getElementById("gameboard").innerHTML += " " + this.wordToGuess[i] + " ";
      } else {
        document.getElementById("gameboard").innerHTML += " _ ";
      }
    }
  }

  // Handles user's input after clicking the guessing button.
  handleUserInput(e) {
    event.preventDefault();

    // Makes sure the game doesn't continue after the player has won.
    if(!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("guess").disabled = true;
      document.getElementById("win").innerHTML = "You won!";
      return;
    }

    // Makes sure the game doesn't continue after the player has lost.
    if (this.lives <= 0) {
      document.getElementById("guess").disabled = true;
      document.getElementById("lost").innerHTML = "You lost!";
      return;
    }

    // Resets error messages after every click.
    document.getElementById("error").innerHTML = "";

    // Saves user's input.
    let userInput = document.getElementById("guess").value.toLowerCase();

    // Resets input field after every click.
    document.getElementById("guess").value = '';

    // Makes sure, that user inputs only one character.
    if (userInput.length != 1) {
      document.getElementById("error").innerHTML = "You should only enter one character at a time!";
      return;
    }

    // Makes sure, that user inputs a string.
    if(!isNaN(userInput)) {
      document.getElementById("error").innerHTML = "You should only enter string characters";
      return;
    }

    // Checks, if the character has already been used.
    if (this.usedCharacters.includes(userInput.toUpperCase())) {
      document.getElementById("error").innerHTML = "This character has been used already!";
      document.getElementById("guessedResult").innerHTML = this.usedCharacters;
      return;
    }

    // Pushes a new character to usedCharacters.
    this.usedCharacters.push(userInput.toUpperCase());

    // Shows guessed characters on the screen.
    document.getElementById("guessedResult").innerHTML = this.usedCharacters;

    // Checks, if user's guess was wrong.
    if(!this.wordToGuess.includes(userInput)) {

      // If user guessed wrong, subtracts one life and checks if game is over or not.
      this.lives --;

      // If the lives hit 0, lets user know that he lost.
      if (this.lives <= 0) {
        document.getElementById("error").innerHTML = `The word was: ${this.wordToGuess}. Better luck next time!`;
        document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
        document.getElementById("lost").innerHTML = "You lost!";
        return;
      }

      // If there are enough lives left, lets the player know that the guess was wrong.
      document.getElementById("livesLeft").innerHTML = "Lives left: " + this.lives;
      document.getElementById("error").innerHTML = 'The character "' + userInput + '" is not in the word! You lost a life!'
      return;
    }

    // Saves correctly guessed character to an array.
    this.correctCharacters.push(userInput);

    // Loads the game board again with updated characters.
    this.loadGameBoard(this.wordToGuess);

    // If the string doesnt contain "_", player has won.
    if (!document.getElementById("gameboard").innerHTML.includes("_")) {
      document.getElementById("win").innerHTML = "You won!";
    }
  }
}