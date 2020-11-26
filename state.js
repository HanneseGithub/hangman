import Game from './game.js';

// Create and save a new Game object.
const theGame = new Game();

// Export the initialized game object, allowing only one instance to be active at a time.
export const game = () => theGame;