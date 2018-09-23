import { ProjectileBullet } from '../../Bullet';
import { Behavior } from '../../BulletBehavior';
import { Game } from '../../Game';
import { Vector2 } from '../../Vector2';
export class QuadMovement extends Behavior<ProjectileBullet> {
  private highOrderXSign: number;
  private highOrderYSign: number;
  public constructor(
    private velocity: Vector2,
    private acceleration: Vector2 = new Vector2(0, 0),
  ) {
    super();
    this.highOrderXSign = acceleration.x < 0
      ? -1
      : acceleration.x > 0
        ? 1
        : velocity.x < 0
          ? -1
          : velocity.x > 0
            ? 1
            : 0;
    this.highOrderYSign = acceleration.y < 0
      ? -1
      : acceleration.y > 0
        ? 1
        : velocity.y < 0
          ? -1
          : velocity.y > 0
            ? 1
            : 0;
  }
  public step(game: Game, bullet: ProjectileBullet): boolean {
    bullet.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    const halfDimension = bullet.shape.dimension / 2;
    return (
      (bullet.position.x < -halfDimension && this.highOrderXSign !== 1) ||
      (bullet.position.y < -halfDimension && this.highOrderYSign !== 1) ||
      (
        (bullet.position.x > game.dimension.x + halfDimension) &&
        (this.highOrderXSign !== -1)
      ) ||
      (
        (bullet.position.y > game.dimension.y + halfDimension) &&
        (this.highOrderYSign !== -1)
      )
    );
  }
}
