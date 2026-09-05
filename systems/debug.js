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
    this.timer = 0;
    this.frames = 0;
    this.ctr = 0;
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

    this.timer += dt;
    this.ctr += 1;

    if (this.timer >= 1) {
      this.frames = roundTo(1 / (this.timer / this.ctr), 2);
      this.ctr = 0;
      this.timer -= this.timer;
    }

    this.fpsLabel.setText(`fps: ${this.frames}`);
  }
}

export { DebugOverlay };
