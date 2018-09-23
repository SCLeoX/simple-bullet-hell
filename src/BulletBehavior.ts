import { Bullet } from './Bullet';
import { Game } from './Game';
export abstract class Behavior<T extends Bullet> {
  public abstract step(game: Game, bullet: T): boolean;
}
