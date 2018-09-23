import { TempVector2, Vector2 } from './Vector2';
export abstract class BulletShape {
  public abstract identifier: string;
  public abstract preRender(preRender: ((shape: BulletShape) => any)): any;
  public abstract render(ctx: CanvasRenderingContext2D, preRendered: any);
  public abstract detectCollision(position: TempVector2): boolean;
}
export abstract class ProjectileBulletShape extends BulletShape {
  public abstract dimension: number;
}
