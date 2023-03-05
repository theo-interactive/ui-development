import gsap from 'gsap';
import frames from './data';

// @ts-ignore
Math.lerp = function(start, end, ratio) {
  return start + (end - start) * ratio;
}


const CANVAS_WIDTH = 1004;
const CANVAS_HEIGHT = 1214;
const ROTATE_DISTANCE:number = 700;
const TELE_DISTANCE:number = 300;
const TELE_AMOUNT:number = 100;

class App {

  frames: HTMLImageElement[] = [];
  cuId: number = 0;
  max: number | null = null;
  isLoaded: boolean = false;
  isEnabled: boolean = false;

  windowHeight: number | null = null;
  stickyInnerHeight: number | null = null;

  rotateProgressRatio: number = 1.0;
  canvasRatio: number = 1.0;
  visualRatio: number = 1.0;
  startScale: number = 1.0;

  mainEl: HTMLElement | undefined | null;
  heroEl: HTMLDivElement | undefined | null;
  stickyWrapEl: HTMLDivElement | undefined | null;
  stickyInnerEl: HTMLDivElement | undefined | null;
  productEl: HTMLDivElement | undefined | null;
  productVisualEl: HTMLDivElement | undefined | null;
  canvasEl: HTMLCanvasElement | undefined | null;
  cupsEl: HTMLDivElement | undefined | null;
  frameEl: HTMLDivElement | undefined | null;
  context: CanvasRenderingContext2D | undefined | null;

  constructor() {
    this.layout();
    this.drawCanvas();
    this.preloadFrame();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.mainEl = document.querySelector('#main') as HTMLElement;
    this.heroEl = this.mainEl.querySelector('#hero') as HTMLDivElement;
    this.stickyWrapEl = this.heroEl.querySelector('.sticky-wrap') as HTMLDivElement;
    this.stickyInnerEl = this.stickyWrapEl.querySelector('.sticky-inner') as HTMLDivElement;
    this.productEl = this.heroEl.querySelector('#product') as HTMLDivElement;
    this.productVisualEl = this.productEl.querySelector('#product-visual') as HTMLDivElement;
    this.canvasEl = this.productVisualEl.querySelector('#frame-sequence') as HTMLCanvasElement;
    this.cupsEl = this.productVisualEl.querySelector('#cups') as HTMLDivElement;
    this.frameEl = this.productVisualEl.querySelector('#frame') as HTMLDivElement;
  }

  addEvent() {
    window.addEventListener('resize', this.handleResizeWindow.bind(this));
    window.addEventListener('scroll', this.handleScrollWindow.bind(this), { passive: true });
  }

  reset() {
    this.rotateProgressRatio = ROTATE_DISTANCE / (ROTATE_DISTANCE + TELE_DISTANCE);
    this.canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    this.startScale = 1 / 1.5;
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
  }

  drawCanvas() {
    if (!this.canvasEl) {
      return
    }
    this.canvasEl.setAttribute("width", `${CANVAS_WIDTH}`);
    this.canvasEl.setAttribute("height", `${CANVAS_HEIGHT}`);
    this.context = this.canvasEl.getContext("2d");
  }

  preloadFrame() {
    let loadedCheckCount = 0;
    this.max = frames.length;
    for (let i = 0; i < this.max; i++) {
      const imageUrl = frames[i];
      const img = new Image();
      img.onload = () => {
        if (!this.mainEl || !this.max) {
          return
        }
        loadedCheckCount++;
        if (loadedCheckCount >= this.max) {
          this.isLoaded = true;
          this.mainEl.classList.remove('inactive');
          this.drawFrame();
          window.dispatchEvent(new Event('scroll'));
        }
      };
      this.frames.push(img);
      img.src = imageUrl;
    }
  }

  drawFrame(ratio: number = 0) {
    if (this.max === null || !this.isLoaded || !this.context) {
      return
    }
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // @ts-ignore
    const id = Math.round(Math.lerp(0, this.max - 1, ratio));
    this.context.drawImage(this.frames[id], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  visualScroll() {
    if (!this.isLoaded || this.windowHeight === null ||  !this.stickyWrapEl || !this.productVisualEl || !this.cupsEl || !this.frameEl || !this.context) {
      return
    }
    const { y, height } = this.stickyWrapEl.getBoundingClientRect();
    const limit = height - this.windowHeight;
    if (y <= 0 && limit + y >= 0) {
      const current = Math.min(1, (y * -1) / ROTATE_DISTANCE);
      const scaleRatio = (y * -1) / limit;
      // @ts-ignore
      const visualScale = this.startScale + Math.lerp(0, 1 - this.startScale, scaleRatio);
      gsap.set(this.productVisualEl, { scale: visualScale });
      if (current > this.rotateProgressRatio) {
        this.cupsEl.classList.add('visible');
        this.frameEl.classList.add('visible');
      } else {
        this.cupsEl.classList.remove('visible');
        this.frameEl.classList.remove('visible');
        gsap.set(this.frameEl, { y: 0 });
      }
      if (current <= this.rotateProgressRatio) {
        // @ts-ignore
        const ratio = Math.lerp(0, 1, current / this.rotateProgressRatio);
        return this.drawFrame(ratio);
      }
      // @ts-ignore
      const frameY = Math.lerp(0, 1, (current - this.rotateProgressRatio) / (1 - this.rotateProgressRatio)) * TELE_AMOUNT * -1;
      gsap.set(this.frameEl, { y: frameY });
      this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }
    if (y > 0) {
      gsap.set(this.productVisualEl, { scale: this.startScale });
      return;
    }
    gsap.set(this.productVisualEl, { scale: 1.0 });
  }

  handleResizeWindow() {
    if (!this.stickyWrapEl || !this.stickyInnerEl || !this.productVisualEl) {
      return
    }
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window
    this.windowHeight = windowHeight;
    this.visualRatio = this.productVisualEl.offsetWidth / this.productVisualEl.offsetHeight;
    this.stickyInnerHeight = this.visualRatio > this.canvasRatio ? 1.5 * windowHeight : windowWidth * this.canvasRatio * 1.5
    this.stickyInnerEl.style.height = `${this.stickyInnerHeight}px`;
    this.stickyWrapEl.style.height = `${this.stickyInnerHeight + TELE_DISTANCE + ROTATE_DISTANCE}px`;
  }

  handleScrollWindow() {
    if (this.isEnabled) {
      return;
    }
    this.isEnabled = true;
    window.requestAnimationFrame(() => {
      this.visualScroll();
      this.isEnabled = false;
    });
  }
}

new App();
