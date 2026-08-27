import { Game } from "./game.js";
import { render } from "./render.js";

render();
const canvas = document.getElementById("main-canvas");
const game = new Game(canvas);
game.start();
