import { separate } from "./collisions.js";
import { gameSettings, playerSettings } from "./global.js";
import { Rect } from "./rect.js";
import { Vector2 } from "./vector.js";
import { AnimatedSprite } from "./animation.js";

class Player extends Rect {
  constructor(
    x,
    y,
    width,
    height,
    hitboxWidth,
    hitboxHeight,
    zIndex,
    collision,
    input,
    color = "red",
  ) {
    super(x, y, hitboxWidth, hitboxHeight, zIndex, color);
    this.speed = playerSettings.speed;
    this.collision = collision;
    this.input = input;
    this.animation = new AnimatedSprite(
      "assets/sprites/shadow_dog.png",
      this.position.x,
      this.position.y,
      width,
      height,
      575,
      523,
    );
    this.animation.add("idle", 0, 6);
    this.animation.add("run", 3, 8);
  }
  update(delta) {
    const dir = new Vector2();

    if (this.input.isDown("move_up")) dir.y -= 1;
    if (this.input.isDown("move_down")) dir.y += 1;
    if (this.input.isDown("move_left")) {
      dir.x -= 1;
      this.animation.flipH = true;
    }
    if (this.input.isDown("move_right")) {
      dir.x += 1;
      this.animation.flipH = false;
    }

    if (dir.x || dir.y) this.animation.select("run");
    else this.animation.select("idle");

    const normalized = dir.normalize();
    this.position.x += normalized.x * this.speed * delta;
    this.position.y += normalized.y * this.speed * delta;

    this.keepInBounds();

    this.animation.update(delta);

    this.collision.check(this);
  }
  keepInBounds() {
    for (const axis of ["x", "y"]) {
      const dim = axis === "x" ? "width" : "height";
      if (this.position[axis] <= 0) this.position[axis] = 0;
      if (this.position[axis] + this[dim] >= gameSettings[dim])
        this.position[axis] = gameSettings[dim] - this[dim];
    }
  }
  onHit(entity) {
    separate(this, entity);
  }
  draw(ctx) {
    // Hitbox
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // Sprite
    this.animation.position = this.position;
    this.animation.draw(ctx, this.width, this.height);
  }
}

export { Player };
