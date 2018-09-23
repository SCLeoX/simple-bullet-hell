import { Bullet } from './Bullet';
import { ControlMode } from './ControlMode';
import { IAdaptInfo } from './extraordinarySpaghettiFullscreenEnabler';
import { Input } from './Input';
import { Player } from './Player';
import { RenderingHandle } from './RenderingHandle';
import { Vector2 } from './Vector2';
export class Game {
  private bulletsMap: Map<number, Set<Bullet>> = new Map();
  private bulletsSet: Set<Bullet> = new Set();
  private score: number = 0;
  private lastRenderedScore: number = 0;
  public player: Player;
  public input: Input = new Input(window);
  public live: boolean = true;
  public constructor(
    public dimension: Vector2,
    public adaptInfo: IAdaptInfo,
    public controlMode: ControlMode = ControlMode.KEYBOARD,
  ) {
    this.player = new Player(dimension.clone().scalarDivide(2), this);
  }
  public increaseScore(amount: number) {
    if (!this.live) {
      return;
    }
    this.score += amount;
  }
  public addBullet(bullet: Bullet) {
    let bulletsWithinLayer = this.bulletsMap.get(bullet.layer);
    if (!bulletsWithinLayer) {
      this.bulletsMap.set(bullet.layer, bulletsWithinLayer = new Set());
    }
    bulletsWithinLayer.add(bullet);
    this.bulletsSet.add(bullet);
    bullet.alive = true;
  }
  public addBullets(bullets: Iterable<Bullet>) {
    for (const bullet of bullets) {
      this.addBullet(bullet);
    }
  }
  public deleteBullet(bullet: Bullet) {
    const bulletsWithinLayer = this.bulletsMap.get(bullet.layer);
    if (!bulletsWithinLayer) {
      return;
    }
    bulletsWithinLayer.delete(bullet);
    if (bulletsWithinLayer.size === 0) {
      this.bulletsMap.delete(bullet.layer);
    }
    this.bulletsSet.delete(bullet);
    bullet.alive = false;
  }
  public deleteBullets(bullets: Iterable<Bullet>) {
    for (const bullet of bullets) {
      this.deleteBullet(bullet);
    }
  }
  public render(
    ctx: CanvasRenderingContext2D,
    elapsedTime: number,
    totalTime: number,
  ) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.dimension.x, this.dimension.y);

    const renderingHandle = new RenderingHandle(
      ctx,
      [1, 0, 0, 1, 0, 0],
      elapsedTime,
      totalTime,
    );

    this.player.render(renderingHandle);

    const sortedEntries = Array.from(this.bulletsMap.entries()).sort();
    for (const entry of sortedEntries) {
      for (const bullet of entry[1].values()) {
        bullet.render(renderingHandle);
      }
    }

    ctx.globalCompositeOperation = 'exclusion';
    ctx.fillStyle = 'white';
    if (!this.live) {
      ctx.fillRect(0, 0, this.dimension.x, this.dimension.y);
    }
    ctx.font = '45px "Press Start 2P"';
    ctx.textBaseline = 'bottom';
    const deltaScore = this.score - this.lastRenderedScore;
    const halfDeltaScore = deltaScore / 2;
    this.lastRenderedScore = this.score;
    ctx.fillText(
      this.score + ' pts',
      30 + this.adaptInfo.scaledShifted.x
        + Math.floor(Math.random() * deltaScore) - halfDeltaScore,
      this.dimension.y - 30 - this.adaptInfo.scaledShifted.y
        + Math.floor(Math.random() * deltaScore) - halfDeltaScore,
    );
    ctx.globalCompositeOperation = 'source-over';
  }
  public step() {
    this.player.step();
    const tempPosition = new Vector2(0, 0);
    for (const bullet of this.bulletsSet) {
      bullet.step(this);
      tempPosition.set(this.player.position.x, this.player.position.y);
      if (bullet.detectCollision(tempPosition)) {
        this.live = false;
      }
    }
  }
}
