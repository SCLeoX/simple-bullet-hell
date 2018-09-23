import { Behavior } from './BulletBehavior';
import { ProjectileBulletShape } from './BulletShape';
import { Game } from './Game';
import { Random } from './Random';
import { RenderingHandle } from './RenderingHandle';
import { TempVector2, Vector2 } from './Vector2';
export abstract class Bullet {
  public alive: boolean = false;
  public abstract layer: number;
  public abstract score: number;
  public constructor(
    public random: Random,
  ) {}
  public abstract render(renderingHandle: RenderingHandle);
  public abstract step(game: Game);
  public abstract detectCollision(position: TempVector2);
}
export abstract class PositionedBullet extends Bullet {
  public deltaPosition = new Vector2(0, 0);
  private lastTickPosition: Vector2;
  public constructor(
    random: Random,
    public position: Vector2,
  ) {
    super(random);
    this.lastTickPosition = position.clone();
  }
  public render(renderingHandle: RenderingHandle) {
    const ctx = renderingHandle.ctx;
    const transform = renderingHandle.transform;
    ctx.translate(this.position.x, this.position.y);
    this.positionedRender(ctx);
    ctx.setTransform.apply(ctx, transform);
  }
  public step(game: Game) {
    this.deltaPosition.set(
      this.position.x - this.lastTickPosition.x,
      this.position.y - this.lastTickPosition.y,
    );
    this.lastTickPosition.setTo(this.position);
  }
  public abstract positionedRender(ctx: CanvasRenderingContext2D);
}
export class ProjectileBullet<
  T extends ProjectileBulletShape = ProjectileBulletShape
> extends PositionedBullet {
  public layer: number = 100;
  public score: number = 1;
  private static renderingCaches: Map<string, any> = new Map();
  public static preRender(shape: ProjectileBulletShape): any {
    let renderingCache = ProjectileBullet.renderingCaches.get(shape.identifier);
    if (!renderingCache) {
      ProjectileBullet.renderingCaches.set(
        shape.identifier,
        renderingCache = shape.preRender(ProjectileBullet.preRender),
      );
    }
    return renderingCache;
  }
  private renderingCache: any;
  private behaviors: Array<Behavior<ProjectileBullet>> = [];
  public rotation: number = 0;
  public constructor(
    random: Random,
    position: Vector2,
    public shape: T,
  ) {
    super(random, position);
    this.renderingCache = ProjectileBullet.preRender(shape);
  }
  public addBehavior(...behaviors: Array<Behavior<ProjectileBullet>>) {
    this.behaviors.push(...behaviors);
  }
  public step(game: Game) {
    super.step(game);
    let flag = true;
    for (const behavior of this.behaviors) {
      if (!behavior.step(game, this)) {
        flag = false;
      }
    }
    if (flag) {
      game.increaseScore(this.score);
      game.deleteBullet(this);
    }
  }
  public positionedRender(ctx: CanvasRenderingContext2D) {
    if (this.rotation !== 0) {
      ctx.rotate(this.rotation);
    }
    this.shape.render(ctx, this.renderingCache);
  }
  public detectCollision(position: TempVector2): boolean {
    position.minus(this.position);
    if (this.rotation !== 0) {
      position.rotateAroundOrigin(-this.rotation);
    }
    return this.shape.detectCollision(position);
  }
}
