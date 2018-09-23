import { Bullet } from '../Bullet';
import { Behavior } from '../BulletBehavior';
import { Game } from '../Game';

export class StatelessBehavior extends Behavior<Bullet> {
  public constructor(
    public func: ((game: Game, bullet: Bullet) => boolean);
  ) {
    super();
  }
  public step(game: Game, bullet: Bullet) {
    return this.func(game, bullet);
  }
}
