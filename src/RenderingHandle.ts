export class RenderingHandle {
  public constructor(
    public ctx: CanvasRenderingContext2D,
    public transform: Array<number>,
    public elapsedTime: number,
    public totalTime: number,
  ) {}
}
