const FPS: number = 24;

class App {

  col: number = 8;
  row: number = 4;
  max: number = 32;
  imageWidth: number = 904;
  imageHeight: number = 468;

  clipEl: HTMLDivElement | null | undefined;

  clipWidth: number | null = null;
  clipHeight: number | null = null;
  cuId: number = 0;
  isReverse: boolean = false;
  timer: number | null = null;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.clipEl = document.querySelector('#clip') as HTMLDivElement;
  }

  addEvent() {
    if (!this.clipEl) {
      return
    }
    this.clipEl.addEventListener('mouseenter', this.handleMouseEnterClipEl.bind(this));
    this.clipEl.addEventListener('mouseleave', this.handleMouseLeaveClipEl.bind(this));
  }

  reset() {
    this.clipWidth = this.imageWidth / this.col;
    this.clipHeight = this.imageHeight / this.row;
    this.updateFrame();
  }

  playFrame() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.progressFrame.bind(this), 1000 / FPS);
  }

  stopFrame() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }

  progressFrame() {
    if (!this.isReverse) {
      this.cuId++;
    } else {
      this.cuId--;
    }
    if (this.cuId <= 0) {
      this.cuId = 0;
      if (this.isReverse) {
        this.stopFrame();
      }
    }
    if (this.cuId >= this.max - 1) {
      this.cuId = this.max - 1;
      if (!this.isReverse) {
        this.stopFrame();
      }
    }
    this.updateFrame();
  }

  updateFrame() {
    if (this.clipWidth === null || this.clipHeight === null || !this.clipEl) {
      return
    }
    const posX = this.cuId % this.col * this.clipWidth * -1;
    const posY = Math.floor(this.cuId / this.col) * this.clipHeight * -1;
    this.clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
  }

  handleMouseEnterClipEl() {
    if (this.cuId > this.max - 1) {
      return
    }
    this.stopFrame();
    this.isReverse = false;
    this.playFrame();
  }

  handleMouseLeaveClipEl() {
    if (this.cuId < 0) {
      return
    }
    this.stopFrame();
    this.isReverse = true;
    this.playFrame();
  }
}

new App();
