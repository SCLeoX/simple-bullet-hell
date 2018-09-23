import { Controls } from '../behaviors/Controls';
import { CircularPattern } from '../behaviors/projectile/patterns/CircularPatterns';
import { QuadMovement } from '../behaviors/projectile/QuadMovement';
import { SummonPattern } from '../behaviors/projectile/SummonPattern';
import { MoveTo } from '../behaviors/projectile/Transit';
import { ProjectileBullet } from '../Bullet';
import { Behavior } from '../BulletBehavior';
import { Game } from '../Game';
import { MultiFrame } from '../projectileShapes/MultiFrame';
import { Rectangle } from '../projectileShapes/Rectangle';
import { Random } from '../Random';
import { Vector2 } from '../Vector2';
import { StatelessBehavior } from '../behaviors/StatelessBehavior';

class SimpleSquareBehavior extends Behavior<SimpleSquare> {
  private stepNumber: number = 0;
  public step(game: Game, bullet: SimpleSquare): boolean {
    bullet.shape.index = Math.floor(Math.random() * 3);
    const stepNumber = this.stepNumber++;
    if (stepNumber % 10 === 0) {
      const directionVector = game.player.position
        .clone()
        .minus(bullet.position)
        .normalize()
        .rotateAroundOrigin(Math.random() * 0.2 - 0.1);
      const newBullet = new ProjectileBullet(
        bullet.random,
        bullet.position.clone(),
        new Rectangle(20, 20),
      );
      const behavior = new QuadMovement(
        directionVector.clone().scalarMultiply(4),
        directionVector.scalarDivide(60),
      );
      newBullet.addBehavior(behavior);
      game.addBullet(newBullet);
    }
    return false;
  }
}

export class SimpleSquare extends ProjectileBullet<MultiFrame> {
  public layer: number = 200;
  public constructor(position: Vector2) {
    super(
      new Random(100),
      position,
      new MultiFrame([
        new Rectangle(50, 50, 'red'),
        new Rectangle(50, 50, 'yellow'),
        new Rectangle(50, 50, 'blue'),
      ]),
    );
    this.addBehavior(
      Controls.shuffledSequential()
        // RED
        .addBehavior(3, () => Controls.parallel(false)
          .addBehavior(new StatelessBehavior(() => {
            this.shape.index = 0;
            return true;
          }))
          .addBehavior(new MoveTo(
            this.position.clone(),
            new Vector2(500, 500),
            300,
          ))
          .addBehavior(new SummonPattern(
            CircularPattern.create({
              arms: 6,
            }),
            () => new Rectangle(14, 14),
          )),
        )

        // YELLOW
        .addBehavior(3, () => Controls.parallel(false)
          .addBehavior(new StatelessBehavior(() => {
            this.shape.index = 1;
            return true;
          }))
          .addBehavior(new MoveTo(
            this.position.clone(),
            new Vector2(500, 500),
            400,
          ))
          .addBehavior(new SummonPattern(
            CircularPattern.create({
              arms: 4,
              bulletAcceleration: -0.01,
              intervalBetweenRounds: 8,
              launchSpeed: 2,
              totalTime: 400,
            }),
            () => new Rectangle(26, 26, 'yellow'),
          )),
        )

        // BLUE
        .addBehavior(3, () => Controls.parallel(false)
          .addBehavior(new StatelessBehavior(() => {
            this.shape.index = 2;
            return true;
          }))
          .addBehavior(new MoveTo(
            this.position.clone(),
            new Vector2(500, 500),
            200,
          ))
          .addBehavior(new SummonPattern(
            CircularPattern.create({
              arms: 5,
              intervalBetweenRounds: 5,
              launchSpeed: 0.4,
              totalTime: 200,
            }),
            () => new Rectangle(12, 12, 'blue'),
          ))
          .addBehavior(new SummonPattern(
            CircularPattern.create({
              arms: 5,
              intervalBetweenRounds: 5,
              launchSpeed: 0.4,
              targetingRotation: -Math.PI * 2,
              totalTime: 200,
            }),
            () => new Rectangle(12, 12, 'blue'),
          )),
        ),
    );
  }
}
