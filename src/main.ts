import { SimpleSquare } from './bosses/SimpleSquare';
import { Bullet } from './Bullet';
import { Game } from './Game';
import { Circle } from './projectileShapes/Circle';
import { Ellipse } from './projectileShapes/Ellipse';
import { Rectangle } from './projectileShapes/Rectangle';
import { Vector2 } from './Vector2';
const width = 1366;
const height = 768;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = false;
(ctx as any).msImageSmoothingEnabled = false; // IE

// Sorry, I have to do this.
import { letsRunTheExtraordinarySpaghettiFullScreenEnabler } from './extraordinarySpaghettiFullscreenEnabler';
const adaptInfo = letsRunTheExtraordinarySpaghettiFullScreenEnabler(width, height, canvas);

// const gradient = ctx.createRadialGradient(20, 20, 20, 20, 20, 12);
// gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
// gradient.addColorStop(0.8, 'red');
// gradient.addColorStop(1, 'rgb(255, 248, 248)');
// ctx.fillStyle = gradient;
// for (let i = 0; i < 20; i++) {
//   ctx.translate(i * 30, 50 + Math.sin(i / 2) * 50);
//   console.info(100 + i * 30);
//   ctx.fillRect(0, 0, 200, 200);
//   ctx.setTransform(1, 0, 0, 1, 0, 0);
// }

const bullets: Array<Bullet> = [];

const game = new Game(new Vector2(width, height), adaptInfo);
console.info(game);

game.addBullet(new SimpleSquare(new Vector2(200, 200)));

const firstRenderTime = new Date().getTime();
let lastRenderTime = firstRenderTime;
const render = () => {
  const currentTime = new Date().getTime();
  game.render(ctx, currentTime - lastRenderTime, currentTime - firstRenderTime);
  lastRenderTime = currentTime;
  requestAnimationFrame(render);
};

let i = 0;
let r = 0;
const tick = () => {
  const ro = Math.sin(i / 80);
  r += ro * 0.05 + 0.02;
  const m = i % 400 < 50;
  if (m ? i % 2 === 0 : i % 6 === 0) {
    const size = m ? 6 : 10;
    const s = m ? 1.5 : 1 + ro * 0.4;
    const a = m ? -0.005 : 0.002;
    // const br = i % 400 < 50 ? 400 * Math.floor(i / 400) + i % 400 * 8 : 400 * (Math.floor(i / 400) + 1);
    // const dx = 300 * Math.cos(br / 460);
    // const dy = 300 * Math.sin(br / 670);
    const x = width / 2 + width / 2 * Math.cos(i / 767);
    const y = height / 2 + height / 2 * Math.sin(i / 832);
    const pos = new Vector2(x, y);
    const dvel = new Vector2(
      -width / 2 / 767 * Math.sin(i / 767),
      height / 2 / 832 * Math.cos(i / 832),
    );
    // game.addBullets([
    //   new QuadProjectileBullet(
    //     pos.clone(),
    //     new Circle(10),
    //     Vector2.fromDirectionMagnitude(r, s).add(dvel),
    //     Vector2.fromDirectionMagnitude(r, a),
    //   ),
    //   new QuadProjectileBullet(
    //     pos.clone(),
    //     new Rectangle(100, 10),
    //     Vector2.fromDirectionMagnitude(r + Math.PI * 2 / 3, s).add(dvel),
    //     Vector2.fromDirectionMagnitude(r + Math.PI * 2 / 3, a),
    //   ),
    //   // new QuadCircleBullet(
    //   //   pos.clone(),
    //   //   size,
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI / 2, s).add(dvel),
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI / 2, a),
    //   // ),
    //   // new QuadCircleBullet(
    //   //   pos.clone(),
    //   //   size,
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI, s).add(dvel),
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI, a),
    //   // ),
    //   // new QuadCircleBullet(
    //   //   pos.clone(),
    //   //   size,
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI * 3 / 2, s).add(dvel),
    //   //   Vector2.fromDirectionMagnitude(r + Math.PI * 3 / 2, a),
    //   // ),
    // ]);
  }
  game.step();
  i++;
};

let tickCount = 0;
const tickPerSecond = 100;
const tickBundle = () => {
  while (
    tickCount < (new Date().getTime() - firstRenderTime) / 1000 * tickPerSecond
  ) {
    tick();
    tickCount++;
  }
};
setInterval(tickBundle, 1000 / tickPerSecond);

render();
