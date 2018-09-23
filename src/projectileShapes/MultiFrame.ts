import { ProjectileBulletShape } from '../BulletShape';
import { TempVector2 } from '../Vector2';

const getIdentifier = (shape: ProjectileBulletShape) => shape.identifier;

export class MultiFrame extends ProjectileBulletShape {
  public dimension: number;
  public identifier: string;
  public index: number = 0;
  public constructor(
    public frames: Array<ProjectileBulletShape>,
  ) {
    super();
    this.identifier = `MULTI_FRAME:<${frames.map(getIdentifier).join('>,<')}>`;
    let max = 0;
    for (const frame of frames) {
      if (frame.dimension > max) {
        max = frame.dimension;
      }
    }
    this.dimension = max;
  }
  public preRender(preRender: (shape: ProjectileBulletShape) => Array<any>) {
    const framePreRenders: Array<any> = [];
    for (const frame of this.frames) {
      framePreRenders.push(preRender(frame));
    }
    return framePreRenders;
  }
  public render(ctx: CanvasRenderingContext2D, preRendered: Array<any>) {
    const frame = this.frames[this.index];
    const preRender = preRendered[this.index];
    frame.render(ctx, preRender);
  }
  public detectCollision(position: TempVector2): boolean {
    const frame = this.frames[this.index];
    return frame.detectCollision(position);
  }
}
