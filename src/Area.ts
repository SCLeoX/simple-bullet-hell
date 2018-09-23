import { Random } from './Random';
import { Vector2 } from './Vector2';

export class Area {
  public width: number;
  public height: number;
  public constructor(
    public leftTop: Vector2,
    public rightBottom: Vector2,
  ) {
    this.width = rightBottom.x - leftTop.x;
    this.height = rightBottom.y - leftTop.y;
  }
  public createAreaWithin(
    leftTop: Vector2,
    rightBottom: Vector2,
  ): Area {
    return new Area(
      leftTop.add(this.leftTop),
      rightBottom.add(this.rightBottom),
    );
  }
  public getRandomPointWithin(
    random: Random,
    margin: number = 0,
  ): Vector2 {
    return new Vector2(
      random.nextInteger(this.leftTop.x + margin, this.rightBottom.x - margin),
      random.nextInteger(this.leftTop.y + margin, this.rightBottom.y - margin),
    );
  }
}
