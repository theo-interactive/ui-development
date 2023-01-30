import gsap from 'gsap';

// @ts-ignore
Math.range = (value: number, x1: number, y1: number, x2: number, y2: number): number => {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

const DEGREE = 10;

class App {

  imageEl: HTMLDivElement | null | undefined;
  btnFigureEl: HTMLAnchorElement | null | undefined;
  figureEl: HTMLElement | null | undefined;
  figureImgEl: HTMLImageElement | null | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.imageEl = document.querySelector('#image') as HTMLDivElement;
    this.btnFigureEl = this.imageEl.querySelector('a') as HTMLAnchorElement;
    this.figureEl = this.btnFigureEl.querySelector('figure') as HTMLElement;
    this.figureImgEl = this.figureEl.querySelector('img') as HTMLImageElement;
  }

  addEvent() {
    if (!this.btnFigureEl || !this.figureEl) {
      return
    }
    this.btnFigureEl.addEventListener('click', this.handleClickBtnImageEl.bind(this));
    this.figureEl.addEventListener('mousemove', this.handleMouseMoveFigureEl.bind(this));
    this.figureEl.addEventListener('mouseleave', this.handleMouseLeaveFigureEl.bind(this));
  }

  reset() {
    if (!this.figureImgEl || !this.figureImgEl) {
      return
    }
    gsap.killTweensOf(this.figureImgEl);
    gsap.set(this.figureImgEl, { rotationX: 0, rotationY: 0 });
  }

  handleClickBtnImageEl(e: MouseEvent) {
    e.preventDefault();
  }

  handleMouseMoveFigureEl(e: MouseEvent) {
    if (!this.figureEl || !this.figureImgEl) {
      return
    }
    const { clientX, clientY, currentTarget } = e;
    const el = currentTarget as HTMLAnchorElement;
    const { width, height} = el.getBoundingClientRect();
    const { top, left} = this.figureEl.getBoundingClientRect();
    const { pageXOffset: xOffset, pageYOffset: yOffset } = window;
    const x = clientX - left + xOffset;
    const y = clientY - top + yOffset;
    // @ts-ignore
    const rotationX = Math.range(y, 0, height, DEGREE * -1, DEGREE);
    // @ts-ignore
    const rotationY = Math.range(x, 0, width, DEGREE * -1, DEGREE);
    gsap.killTweensOf(this.figureImgEl);
    gsap.to(this.figureImgEl, { rotationX, rotationY, duration: 0.2 });
  }

  handleMouseLeaveFigureEl() {
    if (!this.figureImgEl || !this.figureImgEl) {
      return
    }
    gsap.killTweensOf(this.figureImgEl);
    gsap.to(this.figureImgEl, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'sine.out' });
  }
}

new App();
