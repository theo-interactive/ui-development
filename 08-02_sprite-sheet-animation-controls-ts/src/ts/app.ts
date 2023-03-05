const FPS: number = 24;

class App {

  col: number = 8;
  row: number = 4;
  max: number = 32;
  imageWidth: number = 904;
  imageHeight: number = 468;

  clipEl: HTMLDivElement | null | undefined;
  btnPlayEl: HTMLButtonElement | null | undefined;
  btnReverseEl: HTMLButtonElement | null | undefined;
  btnStopEl: HTMLButtonElement | null | undefined;
  btnResetEl: HTMLButtonElement | null | undefined;
  resultEl: HTMLDivElement | null | undefined;
  currentEl: HTMLSpanElement | null | undefined;
  maxEl: HTMLSpanElement | null | undefined;

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
    this.btnPlayEl = document.querySelector('#btn-play') as HTMLButtonElement;
    this.btnReverseEl = document.querySelector('#btn-reverse') as HTMLButtonElement;
    this.btnStopEl = document.querySelector('#btn-stop') as HTMLButtonElement;
    this.btnResetEl = document.querySelector('#btn-reset') as HTMLButtonElement;
    this.resultEl = document.querySelector('#result') as HTMLDivElement;
    this.currentEl = this.resultEl.querySelector('.current') as HTMLSpanElement;
    this.maxEl = this.resultEl.querySelector('.max') as HTMLSpanElement;
  }

  addEvent() {
    if (!this.btnPlayEl || !this.btnReverseEl || !this.btnStopEl || !this.btnResetEl) {
      return
    }
    this.btnPlayEl.addEventListener('click', this.handleClickBtnPlayEl.bind(this));
    this.btnReverseEl.addEventListener('click', this.handleClickBtnReverseEl.bind(this));
    this.btnStopEl.addEventListener('click', this.handleClickBtnStopEl.bind(this));
    this.btnResetEl.addEventListener('click', this.handleClickBtnResetEl.bind(this));
  }

  reset() {
    if (!this.maxEl) {
      return
    }
    this.clipWidth = this.imageWidth / this.col;
    this.clipHeight = this.imageHeight / this.row;
    this.maxEl.innerHTML = `${this.max}`;
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
    if (this.clipWidth === null || this.clipHeight === null || !this.clipEl || !this.currentEl) {
      return
    }
    const posX = this.cuId % this.col * this.clipWidth * -1;
    const posY = Math.floor(this.cuId / this.col) * this.clipHeight * -1;
    this.clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
    this.currentEl.innerHTML = `${this.cuId + 1}`;
  }

  handleClickBtnPlayEl() {
    if (this.cuId > this.max - 1) {
      return
    }
    this.stopFrame();
    this.isReverse = false;
    this.playFrame();
  }

  handleClickBtnReverseEl() {
    if (this.cuId < 0) {
      return
    }
    this.stopFrame();
    this.isReverse = true;
    this.playFrame();
  }

  handleClickBtnStopEl() {
    this.stopFrame();
  }

  handleClickBtnResetEl() {
    this.stopFrame();
    this.cuId = 0;
    this.isReverse = false;
    this.updateFrame();
  }
}

new App();
