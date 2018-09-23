import { ProjectileBulletShape } from '../BulletShape';
import { TempVector2, Vector2 } from '../Vector2';
import { calculateShadowBlur } from './calculateShadowBlur';
export class Rectangle extends ProjectileBulletShape {
  public identifier: string;
  public dimension: number;
  private centerX;
  private centerY;
  public constructor(
    private width: number,
    private height: number,
    private color: string = 'red',
  ) {
    super();
    this.identifier = `RECTANGLE:${width},${height},${color}`;
    const centerX = this.centerX = width * 0.9 + 10;
    const centerY = this.centerY = height * 0.9 + 10;
    this.dimension = (width ** 2 + height ** 2) ** 0.5;
  }
  public preRender(): HTMLCanvasElement {
    const width = this.width;
    const height = this.height;
    const centerX = this.centerX;
    const centerY = this.centerY;
    const canvas = document.createElement('canvas');
    canvas.width = centerX * 2;
    canvas.height = centerY * 2;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.shadowBlur = calculateShadowBlur(Math.min(centerX, centerY));
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.rect(
      centerX - width / 2,
      centerY - height / 2,
      width,
      height,
    );
    ctx.stroke();
    ctx.fill();
    ctx.shadowBlur = 0;
    return canvas;
  }
  public render(ctx: CanvasRenderingContext2D, preRendered: HTMLCanvasElement) {
    ctx.drawImage(preRendered, -this.centerX, -this.centerY);
  }
  public detectCollision(position: TempVector2): boolean {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    return (
      (position.x > -halfWidth) &&
      (position.x < halfWidth) &&
      (position.y > -halfHeight) &&
      (position.y < halfHeight)
    );
  }
}
