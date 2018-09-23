import { Bullet } from '../Bullet';
import { Behavior } from '../BulletBehavior';
import { Game } from '../Game';

type sequenceElement = number | Behavior<Bullet>;
export class Sequential extends Behavior<Bullet> {
  private sequence: Array<sequenceElement> = [];
  private currentOn: number = 0;
  public addWait(step: number): Sequential {
    this.sequence.push(step);
    return this;
  }
  public addBehavior(behavior: Behavior<Bullet>): Sequential {
    this.sequence.push(behavior);
    return this;
  }
  public step(game: Game, bullet: Bullet): boolean {
    const currentSequenceElement = this.sequence[this.currentOn];
    if (currentSequenceElement === undefined) {
      return true;
    }
    if (typeof currentSequenceElement === 'number') {
      this.sequence[this.currentOn] = currentSequenceElement - 1;
      if (currentSequenceElement <= 1) {
        this.currentOn++;
      }
    } else {
      if (currentSequenceElement.step(game, bullet)) {
        this.currentOn++;
      }
    }
    return this.currentOn >= this.sequence.length;
  }
}

export class Parallel extends Behavior<Bullet> {
  private behaviors: Array<Behavior<Bullet>> = [];
  public constructor(
    private race: boolean = false,
  ) {
    super();
  }
  public addBehavior(behavior: Behavior<Bullet>): Parallel {
    this.behaviors.push(behavior);
    return this;
  }
  public step(game: Game, bullet: Bullet): boolean {
    let finishedCount = 0;
    for (const behavior of this.behaviors) {
      if (behavior.step(game, bullet)) {
        finishedCount++;
      }
    }
    if (this.race) {
      return finishedCount >= 1;
    } else {
      return finishedCount === this.behaviors.length;
    }
  }
}

export class Alternate extends Behavior<Bullet> {
  private behaviors: Array<[number, Behavior<Bullet>]>;
  /** The index of behavior currently is running. */
  private currentOn: number = 0;
  /** How many steps since current behavior started. */
  private currentStep: number = 0;
  public addBehavior(steps: number, behavior: Behavior<Bullet>): Alternate {
    this.behaviors.push([steps, behavior]);
    return this;
  }
  public step(game: Game, bullet: Bullet): boolean {
    const tuple = this.behaviors[this.currentOn];
    if (tuple === undefined) {
      return true;
    }
    const [steps, behavior] = tuple;
    this.currentStep++;
    const result = behavior.step(game, bullet);
    if (this.currentStep >= steps) {
      this.currentOn++;
      this.currentStep = 0;
      if (this.currentOn >= this.behaviors.length) {
        this.currentOn = 0;
      }
    }
    return result;
  }
}

export class ShuffledSequential extends Behavior<Bullet> {
  private sequential: Sequential | null = null;
  private components: Array<Behavior<Bullet>> = [];
  public step(game: Game, bullet: Bullet): boolean {
    if (this.sequential === null) {
      const sequential = new Sequential();
      bullet.random.shuffle(this.components);
      for (const component of this.components) {
        sequential.addBehavior(component);
      }
      this.sequential = sequential;
    }
    return this.sequential.step(game, bullet);
  }
  public addBehavior(
    amount,
    creator: () => Behavior<Bullet>,
  ): ShuffledSequential {
    for (let i = 0; i < amount; i++) {
      this.components.push(creator());
    }
    return this;
  }
}

export class Controls {
  public static sequential(): Sequential {
    return new Sequential();
  }
  public static parallel(race: boolean): Parallel {
    return new Parallel(race);
  }
  public static alternate(): Alternate {
    return new Alternate();
  }
  public static shuffledSequential(): ShuffledSequential {
    return new ShuffledSequential();
  }
}
