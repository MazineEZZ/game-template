class State {
	constructor(transitions, { onEnter, onExit } = {}) {
		this.transitions = transitions;
		this.onEnter = onEnter || (() => {});
		this.onExit = onExit || (() => {});
	}
}

class StateManager {
	constructor(states) {
		this.states = states;
	}
	setCurrentState(state) {
		this.currentState = state;
	}
	handleEvent(event) {
		if (this.currentState === undefined) {
			throw new Error("currentState must be specified!");
		}
		for (const trans of this.currentState.transitions) {
			if (trans.event === event) {
				this.currentState.onExit();
				this.currentState = this.states[trans.state];
				this.currentState.onEnter();
				return "Transition Successful";
			}
		}
		console.warn("Not possible");
	}
}

// GAME STATE
const pausedState = new State([
	{
		event: "gameUnpaused",
		state: "play",
	},
	{
		event: "gameMenu",
		state: "menu",
	},
]);
const menuState = new State([
	{
		event: "gameStarted",
		state: "play",
	},
]);
const playState = new State([
	{
		event: "gamePaused",
		state: "paused",
	},
]);

const gameState = new StateManager({
	paused: pausedState,
	menu: menuState,
	play: playState,
});

gameState.setCurrentState(gameState.states.menu);
console.log(gameState.handleEvent("gameStarted"));
console.log(gameState.handleEvent("gamePaused"));
