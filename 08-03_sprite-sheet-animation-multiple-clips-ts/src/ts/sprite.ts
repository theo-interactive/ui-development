type Options = {
  id?: string
  imageUrl?: string
  imageWidth?: number
  imageHeight?: number
  col?: number
  row?: number
  max?: number
  fps?: number
}

class Sprite {
  targetEl: HTMLDivElement | undefined | null;
  clipEl: HTMLDivElement | undefined;
  defaults: Options = { fps: 24 };
  settings: Options = {};
  clipWidth: number | null = null;
  clipHeight: number | null = null;
  cuId: number = 0;
  isReverse: boolean = false;
  timer: number | null = null;

  constructor(target: string, options: Options) {
    this.targetEl = document.querySelector(target) as HTMLDivElement;
    this.settings = {
      ...this.defaults,
      ...options
    }
    this.setting();
    this.create();
    this.addEvent();
    this.reset();
  }

  setting() {
    const { imageWidth = 0, imageHeight = 0, col = 1, row = 1 } = this.settings;
    this.clipWidth = imageWidth / col;
    this.clipHeight = imageHeight / row;
  }

  create() {
    if (!this.targetEl) {
      return;
    }
    const { id, imageUrl, imageWidth = 0, imageHeight = 0 } = this.settings;
    if (!imageUrl || imageUrl === '') {
      return
    }
    this.clipEl = document.createElement('div');
    if (id && id !== '') {
      this.clipEl.id = id;
    }
    this.clipEl.classList.add('clip');
    this.clipEl.style.width = `${this.clipWidth}px`;
    this.clipEl.style.height = `${this.clipHeight}px`;
    this.clipEl.style.backgroundImage = `url(${imageUrl})`;
    this.clipEl.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
    this.targetEl.append(this.clipEl);
  }

  addEvent() {
    if (!this.clipEl) {
      return
    }
    this.clipEl.addEventListener('mouseenter', this.handleMouseEnterClipEl.bind(this));
    this.clipEl.addEventListener('mouseleave', this.handleMouseLeaveClipEl.bind(this));
  }

  reset() {
    this.updateFrame();
  }

  public playFrame() {
    const { fps } = this.settings
    if (!fps) {
      return
    }
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.progressFrame.bind(this), 1000 / fps);
  }

  public stopFrame() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }

  progressFrame() {
    const { max } = this.settings
    if (!max) {
      return
    }
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
    if (this.cuId >= max - 1) {
      this.cuId = max - 1;
      if (!this.isReverse) {
        this.stopFrame();
      }
    }
    this.updateFrame();
  }

  updateFrame() {
    if (!this.clipEl || !this.clipWidth || !this.clipHeight) {
      return
    }
    const { col } = this.settings;
    if (!col) {
      return
    }
    const posX = this.cuId % col * this.clipWidth * -1;
    const posY = Math.floor(this.cuId / col) * this.clipHeight * -1;
    this.clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
  }

  handleMouseEnterClipEl() {
    const { max } = this.settings;
    if (!max) {
      return
    }
    if (this.cuId > max - 1) {
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

export default Sprite;
