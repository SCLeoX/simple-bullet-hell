import { Vector2 } from './Vector2';
export enum Key {
  SHIFT    = 16,
  CTRL     = 17,
  ALT      = 18,
  SPACE    = 32,
  ENTER    = 13,
  LEFT     = 37,
  UP       = 38,
  RIGHT    = 39,
  DOWN     = 40,
  NUMBER_0 = 48,
  NUMBER_1 = 49,
  NUMBER_2 = 50,
  NUMBER_3 = 51,
  NUMBER_4 = 52,
  NUMBER_5 = 53,
  NUMBER_6 = 54,
  NUMBER_7 = 55,
  NUMBER_8 = 56,
  NUMBER_9 = 57,
  A        = 65,
  B        = 66,
  C        = 67,
  D        = 68,
  E        = 69,
  F        = 70,
  G        = 71,
  H        = 72,
  I        = 73,
  J        = 74,
  K        = 75,
  L        = 76,
  M        = 77,
  N        = 78,
  O        = 79,
  P        = 80,
  Q        = 81,
  R        = 82,
  S        = 83,
  T        = 84,
  U        = 85,
  V        = 86,
  W        = 87,
  X        = 88,
  Y        = 89,
  Z        = 90,
}
export class Input {
  private keyState: Array<boolean> = [];
  public mousePosition: Vector2 = new Vector2(0, 0);
  public leftMouseDown: boolean = false;
  public rightMouseDown: boolean = false;

  private updateMousePosition(event: MouseEvent): void {
    this.mousePosition.set(event.clientX, event.clientY);
  }

  constructor(
    public window: Window,
  ) {
    // Remove right click contextmenu
    window.addEventListener('contextmenu', event => event.preventDefault());
    // Init the key state array
    Object.keys(Key).filter(key => !Number.isNaN(+key)).forEach(keyCode => {
      this.keyState[parseInt(keyCode, 10)] = false;
    });
    // Register listeners for keyboard events
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.keyState[event.keyCode] = true;
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keyState[event.keyCode] = false;
    });
    // Register listerners for mouse events
    window.addEventListener('mousemove', (event: MouseEvent) => {
      this.updateMousePosition.bind(this);
    });
    window.addEventListener('mousedown', (event: MouseEvent) => {
      this.updateMousePosition(event);
      if (event.which === 1) {
        this.leftMouseDown = true;
      } else if (event.which === 3) {
        this.rightMouseDown = true;
      }
    });
    window.addEventListener('mouseup', (event: MouseEvent) => {
      this.updateMousePosition(event);
      if (event.which === 1) {
        this.leftMouseDown = false;
      } else if (event.which === 3) {
        this.rightMouseDown = false;
      }
    });
    window.addEventListener('touchstart', (event: TouchEvent) => {
      event.preventDefault();
    }, { passive: false });
  }

  public isKeyPressed(key: Key | number): boolean {
    return this.keyState[key];
  }
}
