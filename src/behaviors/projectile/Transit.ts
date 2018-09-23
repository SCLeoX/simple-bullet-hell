import { Bullet, ProjectileBullet } from '../../Bullet';
import { Behavior } from '../../BulletBehavior';
import { Game } from '../../Game';
import { Vector2 } from '../../Vector2';

const identity = (input: number) => input;

export abstract class TransitTo extends Behavior<ProjectileBullet> {
  protected currentStep: number = 0;
  public constructor(
    protected steps: number,
    public easingFunction: (input: number) => number = identity,
  ) {
    super();
  }
  public nextProgress(): number | null {
    this.currentStep++;
    if (this.currentStep >= this.steps) {
      return null;
    }
    return this.easingFunction(this.currentStep / this.steps);
  }
}

export class MoveTo extends TransitTo {
  public constructor(
    public from: Vector2,
    public target: Vector2,
    steps: number,
    easingFunction?: (input: number) => number,
  ) {
    super(steps, easingFunction);
  }
  public step(game: Game, bullet: ProjectileBullet): boolean {
    let progress = this.nextProgress();
    let finished = false;
    if (progress === null) {
      finished = true;
      progress = 1;
    }
    bullet.position.set(
      this.from.x + (this.target.x - this.from.x) * progress,
      this.from.y + (this.target.y - this.from.y) * progress,
    );
    return finished;
  }
}

export class RotateTo extends TransitTo {
  public constructor(
    public from: number,
    public target: number,
    steps: number,
    easingFunction?: (input: number) => number,
  ) {
    super(steps, easingFunction);
  }
  public step(game: Game, bullet: ProjectileBullet): boolean {
    let progress = this.nextProgress();
    let finished = false;
    if (progress === null) {
      finished = true;
      progress = 1;
    }
    bullet.rotation = this.from + (this.target - this.from) * progress;
    return finished;
  }
}