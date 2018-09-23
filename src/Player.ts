import { ControlMode } from './ControlMode';
import { Game } from './Game';
import { Key } from './Input';
import { RenderingHandle } from './RenderingHandle';
import { Vector2 } from './Vector2';
export class Player {
  private touches: Map<number, Vector2> = new Map();
  private touchMovement = new Vector2(0, 0);
  public constructor(
    public position: Vector2,
    public game: Game,
  ) {
    game.input.window.addEventListener('touchstart', (event: TouchEvent) => {
      Array.prototype.forEach.call(event.changedTouches, (touch: Touch) => {
        this.touches.set(touch.identifier, new Vector2(
          touch.clientX,
          touch.clientY,
        ));
      });
    });
    game.input.window.addEventListener('touchmove', (event: TouchEvent) => {
      const scale = game.adaptInfo.scaled;
      console.info(scale);
      Array.prototype.forEach.call(event.changedTouches, (touch: Touch) => {
        const before = this.touches.get(touch.identifier) as Vector2;
        let deltaX = (touch.clientX - before.x) / scale;
        let deltaY = (touch.clientY - before.y) / scale;
        if (game.adaptInfo.rotated) {
          const swap = deltaX;
          deltaX = -deltaY;
          deltaY = swap;
        }
        this.touchMovement.set(
          this.touchMovement.x + deltaX,
          this.touchMovement.y + deltaY,
        );
        before.set(
          touch.clientX,
          touch.clientY,
        );
      });
    });
    game.input.window.addEventListener('touchend', (event: TouchEvent) => {
      Array.prototype.forEach.call(event.changedTouches, (touch: Touch) => {
        const before = this.touches.delete(touch.identifier);
      });
    });
  }
  public render(renderingHandle: RenderingHandle) {
    const ctx = renderingHandle.ctx;
    const totalTime = renderingHandle.totalTime;
    const angle = totalTime % 2143 / 2143 * Math.PI * 2;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(-15, -15, 30, 30);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.setTransform.apply(ctx, renderingHandle.transform);
  }
  public step() {
    const game = this.game;
    let vector: Vector2;
    const input = game.input;
    switch (game.controlMode) {
      case ControlMode.KEYBOARD: {
        let left = input.isKeyPressed(Key.LEFT) || input.isKeyPressed(Key.A);
        let up = input.isKeyPressed(Key.UP) || input.isKeyPressed(Key.W);
        let right = input.isKeyPressed(Key.RIGHT) || input.isKeyPressed(Key.D);
        let down = input.isKeyPressed(Key.DOWN) || input.isKeyPressed(Key.S);
        if (left && right) {
          left = right = false;
        }
        if (up && down) {
          up = down = false;
        }
        vector = up
          ? left
            ? new Vector2(-Math.SQRT1_2, -Math.SQRT1_2)
            : right
              ? new Vector2(Math.SQRT1_2, -Math.SQRT1_2)
              : new Vector2(0, -1)
          : down
            ? left
              ? new Vector2(-Math.SQRT1_2, Math.SQRT1_2)
              : right
                ? new Vector2(Math.SQRT1_2, Math.SQRT1_2)
                : new Vector2(0, 1)
            : left
              ? new Vector2(-1, 0)
              : right
                ? new Vector2(1, 0)
                : new Vector2(0, 0);
        if (input.isKeyPressed(Key.SHIFT)) {
          vector.scalarMultiply(0.4);
        }
        break;
      }
      default: {
        vector = new Vector2(0, 0);
      }
    }
    vector.scalarMultiply(3);
    vector.add(this.touchMovement);
    this.touchMovement.set(0, 0);
    this.position.add(vector);
  }
}
