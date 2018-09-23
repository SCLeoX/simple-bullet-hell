import { ProjectileBulletShape } from '../BulletShape';
import { TempVector2, Vector2 } from '../Vector2';
import { calculateShadowBlur } from './calculateShadowBlur';
export class Ellipse extends ProjectileBulletShape {
  public identifier: string;
  public dimension: number;
  private renderRadiusX;
  private renderRadiusY;
  private widthToHeightRatio: number;
  public constructor(
    private radiusX: number,
    private radiusY: number,
    private color: string = 'red',
  ) {
    super();
    this.identifier = `ELLIPSE:${radiusX},${radiusY},${color}`;
    const renderRadiusX = this.renderRadiusX = radiusX * 1.8 + 10;
    const renderRadiusY = this.renderRadiusY = radiusY * 1.8 + 10;
    this.widthToHeightRatio = radiusX / radiusY;
    this.dimension = Math.max(renderRadiusX, renderRadiusY) * 2;
  }
  public preRender(): HTMLCanvasElement {
    const renderRadiusX = this.renderRadiusX;
    const renderRadiusY = this.renderRadiusY;
    const radiusX = this.radiusX;
    const radiusY = this.radiusY;
    const canvas = document.createElement('canvas');
    canvas.width = renderRadiusX * 2;
    canvas.height = renderRadiusY * 2;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.shadowBlur = calculateShadowBlur(
      Math.min(renderRadiusX, renderRadiusY)
    );
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.ellipse(
      renderRadiusX,
      renderRadiusY,
      radiusX,
      radiusY,
      0,
      0,
      360,
    );
    ctx.stroke();
    ctx.fill();
    ctx.shadowBlur = 0;
    return canvas;
  }
  public render(ctx: CanvasRenderingContext2D, preRendered: HTMLCanvasElement) {
    ctx.drawImage(preRendered, -this.renderRadiusX, -this.renderRadiusY);
  }
  public detectCollision(position: TempVector2): boolean {
    position.set(
      position.x / this.widthToHeightRatio,
      position.y,
    );
    return position.distanceTo(Vector2.origin) < this.radiusY;
  }
}
