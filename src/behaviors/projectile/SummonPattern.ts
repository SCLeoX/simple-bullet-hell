import { ProjectileBullet } from '../../Bullet';
import { Behavior } from '../../BulletBehavior';
import { ProjectileBulletShape } from '../../BulletShape';
import { Game } from '../../Game';
import { Random } from '../../Random';
import { Vector2 } from '../../Vector2';

export interface IPatternSummonParameters {
  fromBullet: ProjectileBullet;
  createProjectileBullet: (delta: Vector2) => ProjectileBullet;
  game: Game;
  random: Random;
}

export interface IPattern {
  summon(parameters: IPatternSummonParameters): Iterator<number>;
}

export class SummonPattern extends Behavior<ProjectileBullet> {
  public currentWait: number = 0;
  public currentSummon: Iterator<number> | null = null;
  public constructor(
    private pattern: IPattern,
    private shapeCreator: () => ProjectileBulletShape,
    private repeat: number = 1,
  ) {
    super();
  }
  public step(game: Game, bullet: ProjectileBullet): boolean {
    const random = bullet.random;
    if (this.currentWait >= 1) {
      this.currentWait--;
      return false;
    } else {
      if (this.currentSummon === null) {
        this.currentSummon = this.pattern.summon({
          fromBullet: bullet,
          createProjectileBullet: (delta: Vector2) => {
            return new ProjectileBullet(
              random,
              delta.add(bullet.position),
              this.shapeCreator(),
            );
          },
          game,
          random,
        });
      }
      const { done, value } = this.currentSummon.next();
      if (done) {
        this.currentSummon = null;
        this.repeat--;
      } else {
        this.currentWait = value;
      }
    }
    return this.repeat <= 0;
  }
}
