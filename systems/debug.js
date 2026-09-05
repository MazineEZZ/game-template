import { gameSettings } from "../data/settings.js";
import { Label } from "../ui/ui.js";
import { roundTo } from "../utilities/utils.js";

class DebugOverlay {
  constructor(ui, inputs) {
    this.inputs = inputs;
    this.isOn = false;
    this.ui = ui;
    this.fpsLabel = new Label(gameSettings.width - 20, 40, {
      text: "fps: 00",
      align: "right",
      color: "green",
    });
    this.frames = [];
    this.fps = 0;
  }
  set setState(isOn) {
    this.isOn = isOn;
  }
  update(dt) {
    if (this.inputs.isDownOnce("debug_game")) {
      this.setState = !this.isOn;
      if (this.isOn) {
        this.ui.register(this.fpsLabel);
      } else {
        this.ui.unregister(this.fpsLabel);
      }
    }
    if (!this.isOn) return;

    if (this.frames.length >= 30) {
      this.frames.shift();
    }
    this.frames.push(dt);

    this.fps =
      this.frames.reduce((acc, curr) => acc + curr, 0) / this.frames.length;
    this.fps = roundTo(1 / this.fps, 2);
    this.fpsLabel.setText(`fps: ${this.fps}`);
  }
}

export { DebugOverlay };
