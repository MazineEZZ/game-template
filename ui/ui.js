import { gameSettings } from "../data/settings.js";
import { RegistrySystem } from "../systems/registry.js";
import { clamp, colorToRGB } from "../utilities/utils.js";

class UIElement {
  constructor(x, y, zIndex) {
    this.position = { x, y };
    this.zIndex = zIndex;
    this.visible = true;
  }
  draw(ctx) {}
}

class Panel extends UIElement {
  constructor(x, y, zIndex, width, height, color) {
    super(x, y, zIndex);
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Label extends UIElement {
  constructor(
    x,
    y,
    {
      text = "",
      color = "white",
      zIndex = 0,
      borderColor = "black",
      borderSize = 4,
      align = "left",
      baseline = "alphabetic",
      fontSize = "30px",
      fontName = "sans-serif",
      fontSrc = "",
    } = {},
  ) {
    super(x, y, zIndex);
    this.text = text;
    this.color = color;
    this.borderColor = borderColor;
    this.borderSize = borderSize;
    this.align = align;
    this.baseline = baseline;

    this.fontSize = fontSize;
    this.fontName = fontName;

    if (fontSrc !== "") {
      this.font = `${this.fontSize} sans-serif`;
      this.loadFont(fontSrc);
    } else {
      this.font = `${fontSize} ${fontName}`;
    }
  }
  loadFont(fontSrc) {
    const customFont = new FontFace(this.fontName, `url(${fontSrc})`);

    customFont
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        this.font = `${this.fontSize} ${this.fontName}`;
      })
      .catch((err) => ("Font failed to load:  ", err));
  }
  setText(text) {
    this.text = text;
  }
  draw(ctx) {
    if (!this.visible) return;
    ctx.font = this.font;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;
    // Border
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = this.borderSize;
    ctx.lineJoin = "round";
    ctx.strokeText(this.text, this.position.x, this.position.y);
    // Font
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.position.x, this.position.y);
  }
}

class ImageUI extends UIElement {
  constructor(src, x, y, width, height, zIndex) {
    super(x, y, zIndex);
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = src;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }
}

class Button extends UIElement {
  constructor(
    x,
    y,
    width,
    height,
    zIndex,
    events,
    event,
    { btnBorderSize = "", btnBorderColor = "" },
    {
      text = "",
      fontClr = "white",
      borderColor = "black",
      borderSize = 4,
      align = "left",
      baseline = "alphabetic",
      fontSize = "30px",
      fontName = "sans-serif",
      fontSrc = "",
    } = {},
    color = "black",
    hoverClr = "gray",
  ) {
    super(x, y, zIndex);
    this.width = width;
    this.height = height;
    this.color = color;
    this.event = event;
    this.events = events;
    this.unhoverClr = color;
    this.hoverClr = hoverClr;
    this.borderSize = btnBorderSize;
    this.borderColor = btnBorderColor;
    const labelX = this.position.x + this.width / 2;
    const labelY = this.position.y + this.height / 2;
    this.label = new Label(labelX, labelY, {
      text,
      color: fontClr,
      zIndex,
      borderColor,
      borderSize,
      align,
      baseline,
      fontSize,
      fontName,
      fontSrc,
    });
  }
  update(mouse) {
    if (isMouseOverlapping(this, mouse.position)) {
      this.color = this.hoverClr;
    } else {
      this.color = this.unhoverClr;
    }
    if (isMouseOverlapping(this, mouse.lastClickPos)) {
      this.events.emit(this.event);
    }
  }
  draw(ctx) {
    // Border
    ctx.fillStyle = this.borderColor;
    ctx.fillRect(
      this.position.x - this.borderSize,
      this.position.y - this.borderSize,
      this.width + this.borderSize * 2,
      this.height + this.borderSize * 2,
    );
    // Button
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.label.draw(ctx);
  }
}

class Checkbox extends UIElement {
  constructor(
    x,
    y,
    width,
    height,
    zIndex,
    color = "black",
    checkedColor = "rgb(8, 62, 198)",
  ) {
    super(x, y, zIndex);
    this.width = width;
    this.height = height;
    this.color = color;
    this.checkedColor = checkedColor;
    this.inCheck = false;
  }
  update(dt, mouse) {
    if (isMouseOverlapping(this, mouse.lastClickPos)) {
      this.inCheck = !this.inCheck;
    }
  }
  draw(ctx) {
    ctx.save();

    const offset = 4;

    ctx.lineWidth = offset;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

    if (this.inCheck) {
      ctx.fillStyle = this.checkedColor;
      ctx.fillRect(
        this.position.x + offset,
        this.position.y + offset,
        this.width - offset * 2,
        this.height - offset * 2,
      );
    }

    ctx.restore();
  }
}

class ResourceBar extends UIElement {
  constructor(
    x,
    y,
    width,
    height,
    zIndex,
    maxColor = "rgb(0, 255, 0)",
    midColor = "rgb(255, 255, 0)",
    minColor = "rgb(255, 0, 0)",
  ) {
    super(x, y, zIndex);
    this.width = width;
    this.height = height;
    this.progress = 1;
    this.maxColor = colorToRGB(maxColor);
    this.midColor = colorToRGB(midColor);
    this.minColor = colorToRGB(minColor);
    this.progressColor = this.maxColor;
    this.newVal = 1;
    this.maxVal = 1;
    this.minVal = 0;
  }
  setValue(val, max) {
    this.newVal = val / max;
  }
  update(dt) {
    this.progress = clamp(
      this.minVal,
      lerp(this.progress, this.newVal, 5 * dt),
      this.maxVal,
    );
    if (this.progress > 0.5) {
      this.progressColor = lerpColor(
        this.midColor,
        this.maxColor,
        this.progress,
        0.5,
        1,
      );
    } else {
      this.progressColor = lerpColor(
        this.minColor,
        this.midColor,
        this.progress,
        0,
        0.5,
      );
    }
  }
  draw(ctx) {
    ctx.save();
    // Back
    ctx.fillStyle = "black";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // Bar
    const offset = 3;
    ctx.fillStyle = `rgb(${this.progressColor.r}, ${this.progressColor.g}, ${this.progressColor.b})`;
    ctx.fillRect(
      this.position.x + offset,
      this.position.y + offset,
      (this.width - offset * 2) * this.progress,
      this.height - offset * 2,
    );
    ctx.restore();
  }
}

class UILayer extends RegistrySystem {
  constructor() {
    super();
  }
  sortByLayers() {
    this.elements.sort((a, b) => a.zIndex - b.zIndex);
  }
  update(dt, mouse) {
    for (const el of [...this.elements]) {
      if (typeof el.update === "function") {
        el.update(dt, mouse);
      }
    }
  }
  draw(ctx) {
    this.sortByLayers();
    for (const el of [...this.elements]) {
      el.draw(ctx);
    }
  }
}

// UI Helpful Functions
function isMouseOverlapping(element, mousepos) {
  return (
    element.position.x < mousepos.x &&
    mousepos.x < element.position.x + element.width &&
    element.position.y < mousepos.y &&
    mousepos.y < element.position.y + element.height
  );
}

function lerpColor(color1, color2, progress, t1, t2) {
  return {
    r: remap(progress, t1, t2, color1.r, color2.r),
    g: remap(progress, t1, t2, color1.g, color2.g),
    b: remap(progress, t1, t2, color1.b, color2.b),
  };
}

function lerp(a, b, t) {
  // a: the value of the object
  // b: the value to follow
  // t: the time it takes to reach b
  return a + t * (b - a);
}

function remap(t, t1, t2, a, b) {
  // I remade this function using slopes for easier time manipulation
  return a + ((b - a) * (t - t1)) / (t2 - t1);
}

export {
  UILayer,
  Label,
  Panel,
  ImageUI,
  Button,
  ResourceBar,
  Checkbox,
  isMouseOverlapping,
};
