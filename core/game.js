import { gameSettings, inputBindings } from "../data/settings.js";
import { Player } from "../entities/player.js";
import { EntityRegistry } from "../systems/entities.js";
import { CollisionSystem } from "../systems/collisions.js";
import { Inputs } from "../systems/inputs.js";
import { EventBus } from "../systems/events.js";
import { AudioSystem } from "../systems/audio.js";
import { UILayer, Label } from "../ui/ui.js";
import { Hazard } from "../entities/hazard.js";
import { DebugOverlay } from "../systems/debug.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.collisions = new CollisionSystem();
    this.entities = new EntityRegistry();
    this.audio = new AudioSystem();
    this.inputs = new Inputs(inputBindings);
    this.events = new EventBus();
    this.ui = new UILayer();
    this.debugOverlay = new DebugOverlay(this.ui, this.inputs);
    this.lastTime = null;
    this.animationFrameId = null;
    this.score = 0;
    this.isPaused = false;

    // Initial Setup
    this.canvas.width = gameSettings.width;
    this.canvas.height = gameSettings.height;

    this.audio.adjustVolume();
    this.inputs.setUpInputs();
    this.resizeCanvas();

    this.setUpEventListeners();
  }
  setUpEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (!this.inputs.isDown("pause_game")) return;
      if (!this.isPaused) {
        this.events.emit("gamePaused");
      } else {
        this.events.emit("gameUnpaused");
      }
    });
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.draw();
    });
  }
  resizeCanvas() {
    const ratio = gameSettings.ratio;
    let w, h;
    const margin = gameSettings.margin;

    const availableWidth = window.innerWidth - margin * 2;
    const availableHeight = window.innerHeight - margin * 2;

    if (availableWidth / availableHeight > ratio) {
      h = availableHeight;
      w = h * ratio;
    } else {
      w = availableWidth;
      h = w / ratio;
    }

    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.style.margin = margin + "px";
  }
  debugGrid() {
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 6;

    for (let i = 0; i < gameSettings.width; i += gameSettings.grid) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, gameSettings.height);
      this.ctx.stroke();
    }
    for (let i = 0; i < gameSettings.height; i += gameSettings.grid) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(gameSettings.width, i);
      this.ctx.stroke();
    }
  }
  spawn() {
    const player = new Player(
      20,
      20,
      40,
      100,
      40,
      100,
      4,
      300,
      this.collisions,
      this.inputs,
    );
    this.entities.register(player);
  }
  init() {
    this.spawn();

    // Events
    this.events.on("coinCollected", (coin) => {
      this.score++;
      // this.audio.playCollect();
      this.scoreLabel.setText(`Score: ${this.score}`);

      if (this.score >= 1) this.events.emit("levelComplete", {});
    });
    this.events.on("levelComplete", () => {
      this.messageLabel.setText("You won!");
      this.ui.add(this.messageLabel);
      setTimeout(() => this.restart(), 1000);
    });
    this.events.on("playerDied", () => {
      this.messageLabel.setText("You lost!");
      this.ui.add(this.messageLabel);
      setTimeout(() => this.restart(), 1000);
    });
    this.events.on("gamePaused", () => {
      this.messageLabel.setText("Game paused");
      this.ui.add(this.messageLabel);
      this.draw();
      this.stop();
      this.isPaused = true;
    });
    this.events.on("gameUnpaused", () => {
      this.gameLoop();
      this.ui.remove(this.messageLabel);
      this.isPaused = false;
    });
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Background
    this.ctx.fillStyle = gameSettings.bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Entities
    this.entities.draw(this.ctx);
    // UI
    this.ui.draw(this.ctx);
    // this.debugGrid();
  }
  update(dt) {
    // Entities
    this.entities.update(dt);
    this.debugOverlay.update(dt);
  }
  gameLoop() {
    const loop = (timestamp) => {
      if (this.lastTime === null) this.lastTime = timestamp;
      const dt = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      this.update(dt);
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }
  start() {
    this.init();
    this.gameLoop();
  }
  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.lastTime = null;
  }
  restart() {
    this.stop();
    this.score = 0;
    this.entities = new EntityRegistry();
    this.collisions = new CollisionSystem();
    this.events = new EventBus();
    this.ui = new UILayer();
    this.start();
  }
}

export { Game };
