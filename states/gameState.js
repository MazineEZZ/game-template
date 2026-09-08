import { State, StateManager } from "../systems/states.js";

// GAME STATE
const pausedState = new State(
	[
		{
			event: "togglePause",
			state: "play",
		},
		{
			event: "gameMenu",
			state: "menu",
		},
	],
	{
		onEnter: (events) => events.emit("gamePaused"),
		update: (dt, game) => {},
		draw: (game) => {
			// Entities
			game.pauseUI.draw(game.ctx);
		},
	},
);
const menuState = new State([
	{
		event: "gameStarted",
		state: "play",
	},
]);
const playState = new State(
	[
		{
			event: "togglePause",
			state: "paused",
		},
	],
	{
		onEnter: (events) => events.emit("gameUnpaused"),
		update: (dt, game) => {
			// Entities
			game.entities.update(dt);
			game.playUI.update(dt, game.clientMouse);
		},
		draw: (game) => {
			// Entities
			game.entities.draw(game.ctx);
			game.playUI.draw(game.ctx);
		},
	},
);

const gameState = new StateManager({
	paused: pausedState,
	menu: menuState,
	play: playState,
});

export { gameState };
