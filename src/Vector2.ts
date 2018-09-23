export class Vector2 {
  constructor(
    public x: number,
    public y: number,
  ) {}
  public static fromDirectionMagnitude(
    direction: number,
    magnitude: number,
  ): Vector2 {
    return new Vector2(
      magnitude * Math.cos(direction),
      magnitude * Math.sin(direction),
    );
  }
  public static origin = new Vector2(0, 0);
  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  public add(vec: Vector2): Vector2 {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  public minus(vec: Vector2): Vector2 {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
  public scalarMultiply(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  public scalarDivide(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
  public set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }
  public setTo(vec: Vector2): Vector2 {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  public distanceTo(vec: Vector2): number {
    return ((this.x - vec.x) ** 2 + (this.y - vec.y) ** 2) ** 0.5;
  }
  public rotateAroundOrigin(angle): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x;
    const y = this.y;
    this.x = x * cos - y * sin;
    this.y = y * cos + x * sin;
    return this;
  }
  public normalize(): Vector2 {
    const scale = this.distanceTo(Vector2.origin);
    this.scalarDivide(scale);
    return this;
  }
}

// A reminder for Vector2 that are meant to be reused.
export type TempVector2 = Vector2;
