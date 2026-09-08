class State {
	constructor(transitions, { onEnter, onExit } = {}) {
		this.transitions = transitions;
		this.onEnter = onEnter || (() => {});
		this.onExit = onExit || (() => {});
	}
	transition(event) {
		for (const trans of this.transitions) {
			if (trans.event === event) {
				return trans.next;
			}
		}
	}
}

class StateManager {
	constructor(states) {
		this.states = states;
	}
	set currentState(state) {
		this.currentState = state;
	}
	handleEvent(event) {
		const next = currentState;
	}
}

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
});
