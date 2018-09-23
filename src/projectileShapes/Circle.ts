import { ProjectileBulletShape } from '../BulletShape';
import { TempVector2, Vector2 } from '../Vector2';
import { calculateShadowBlur } from './calculateShadowBlur';
export class Circle extends ProjectileBulletShape {
  public identifier: string;
  public dimension: number;
  private renderRadius;
  public constructor(
    private radius: number,
    private color: string = 'red',
  ) {
    super();
    this.identifier = `CIRCLE:${radius},${color}`;
    const renderRadius = this.renderRadius = radius * 1.8 + 10;
    this.dimension = renderRadius * 2;
  }
  public preRender(): HTMLCanvasElement {
    const renderRadius = this.renderRadius;
    const radius = this.radius;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = renderRadius * 2;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.shadowBlur = calculateShadowBlur(this.radius);
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(renderRadius, renderRadius, radius, 0, 360);
    ctx.stroke();
    ctx.fill();
    ctx.shadowBlur = 0;
    return canvas;
  }
  public render(ctx: CanvasRenderingContext2D, preRendered: HTMLCanvasElement) {
    const renderRadius = this.renderRadius;
    ctx.drawImage(preRendered, -renderRadius, -renderRadius);
  }
  public detectCollision(position: TempVector2): boolean {
    return position.distanceTo(Vector2.origin) < this.radius;
  }
}
