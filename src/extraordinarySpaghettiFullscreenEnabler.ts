import { Vector2 } from './Vector2';
export interface IAdaptInfo {
  shifted: Vector2;
  scaledShifted: Vector2;
  scaled: number;
  rotated: boolean;
}
export function letsRunTheExtraordinarySpaghettiFullScreenEnabler(
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
): IAdaptInfo {
  const adaptInfo = {
    shifted: new Vector2(0, 0),
    scaledShifted: new Vector2(0, 0),
    scaled: 1,
    rotated: false,
  };
  const updateSize = () => {
    let wideSize;
    let narrowSize;
    if (window.matchMedia('(orientation: portrait)').matches) {
      wideSize = window.innerHeight;
      narrowSize = window.innerWidth;
      adaptInfo.rotated = true;
    } else {
      wideSize = window.innerWidth;
      narrowSize = window.innerHeight;
      adaptInfo.rotated = false;
    }
    const widthBase = wideSize / width;
    const heightBase = narrowSize / height;
    const ratio = widthBase > heightBase
      ? wideSize / width
      : narrowSize / height;
    const canvasWidth = (width * ratio);
    const canvasHeight = (height * ratio);
    adaptInfo.shifted.set(
      (canvasWidth - wideSize) / 2,
      (canvasHeight - narrowSize) / 2,
    );
    adaptInfo.scaledShifted.set(
      adaptInfo.shifted.x / ratio,
      adaptInfo.shifted.y / ratio,
    );
    adaptInfo.scaled = ratio;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvas.style.transform
      = `translate(${-adaptInfo.shifted.x}px,${-adaptInfo.shifted.y}px)`;
  };
  updateSize();
  window.addEventListener('resize', updateSize);

  let fsWarn = false;
  const noFsSupport = () => {
    if (!fsWarn) {
      fsWarn = true;
      alert('FULLSCREEN NOT SUPPORTED');
    }
  };
  const goFullScreen = () => {
    const docEl = window.document.documentElement as any;
    const requestFullScreen = docEl.requestFullscreen ||
      docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen || noFsSupport;
    requestFullScreen.call(docEl);
  };
  window.addEventListener('click', goFullScreen);
  window.addEventListener('touchend', goFullScreen);
  window.addEventListener('keydown', goFullScreen);

  return adaptInfo;
}
