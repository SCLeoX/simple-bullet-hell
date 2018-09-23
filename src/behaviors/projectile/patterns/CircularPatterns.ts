import { ProjectileBullet } from '../../../Bullet';
import { Vector2 } from '../../../Vector2';
import { QuadMovement } from '../QuadMovement';
import { IPattern } from '../SummonPattern';

const noop = (bullet: ProjectileBullet) => undefined;
const identity = (input: number) => input;

export interface ICircularPatternParameters {
  /** Number of arms. */
  arms: number;
  /** Starting angle of the first arm. Defaults to a random value. */
  startingAngle?: number;
  /** Targeting rotation to be done. Defaults to a full round. */
  targetingRotation?: number;
  /** Steps to finish the pattern. Defaults to 300. */
  totalTime?: number;
  /** Easing function of the rotation. Defaults to identity. */
  easingFunction?: (input: number) => number;
  /** Steps between each round. Defaults to 4. */
  intervalBetweenRounds?: number;
  /** Speed of bullets when launched. Defaults to 1. */
  launchSpeed?: number;
  /** Acceleration of bullets. Defaults to 0.01. */
  bulletAcceleration?: number;
  /** Function being called on every bullet fired. Defaults to noop. */
  bulletCallback?: (bullet: ProjectileBullet) => undefined;
  /** The distance between the bullet created and the creator. Defaults to 0. */
  distanceFromCreator?: number;
  /**
   * Decide whether the direction of the bullet affect the shooting angle.
   * Defaults to false.
   */
  rotationRelativeToDirection?: boolean;
  /** Steps to wait before the pattern starts. Defaults to 1. */
  delay?: number;
}

export class CircularPattern {
  public static create({
    arms,
    startingAngle,
    targetingRotation = Math.PI * 2,
    totalTime = 300,
    easingFunction = identity,
    intervalBetweenRounds = 4,
    launchSpeed = 1,
    bulletAcceleration = 0.01,
    bulletCallback = noop,
    distanceFromCreator = 0,
    rotationRelativeToDirection = false,
    delay = 1,
  }: ICircularPatternParameters): IPattern {
    totalTime -= delay;
    const rounds = Math.ceil(totalTime / (intervalBetweenRounds + 1));
    const angleBetweenArms = Math.PI * 2 / arms;
    return {
      *summon({
        createProjectileBullet,
        fromBullet,
        game,
        random,
      }) {
        if (delay > 0) {
          yield delay;
        }
        let realStartingAngle: number;
        if (startingAngle === undefined) {
          realStartingAngle = random.nextReal(0, Math.PI * 2);
        } else {
          realStartingAngle = startingAngle;
        }
        for (let i = 0; i < rounds; i++) {
          if (!fromBullet.alive) {
            return;
          }
          const roundStartingAngle = realStartingAngle
            + easingFunction((i + 1) / rounds) * targetingRotation
            + (rotationRelativeToDirection ? fromBullet.rotation : 0);
          for (let j = 0; j < arms; j++) {
            const angle = roundStartingAngle + j * angleBetweenArms;
            const directionVector = Vector2.fromDirectionMagnitude(angle, 1);
            let delta: Vector2;
            if (distanceFromCreator === 0) {
              delta = Vector2.origin.clone();
            } else {
              delta
                = directionVector.clone().scalarMultiply(distanceFromCreator);
            }
            const velocity = directionVector
              .clone()
              .scalarMultiply(launchSpeed)
              .add(fromBullet.deltaPosition);
            const acceleration
              = directionVector.scalarMultiply(bulletAcceleration);
            const createdBullet = createProjectileBullet(delta);
            createdBullet.addBehavior(new QuadMovement(
              velocity,
              acceleration,
            ));
            game.addBullet(createdBullet);
          }
          yield intervalBetweenRounds;
        }
      },
    };
  }
}
