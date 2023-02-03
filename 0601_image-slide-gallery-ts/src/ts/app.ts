import gsap from 'gsap';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min';


const INFINITE: boolean = true;
const IMAGE_WIDTH: number = 1000;
const IMAGE_HEIGHT: number = 625;
const BASE_DURATION: number = 0.3;
const ADD_DURATION: number = 0.1;
const TIME: number = 6;

class App {

  isAni: boolean = false;
  galleryWidth: number | null = null;
  galleryHeight: number | null = null;
  cuId: number = 0;
  exId: number | null = null;
  max: number | null = null;
  timer: number | null = null;

  imageGalleryEl: HTMLDivElement | null | undefined;
  imageWrapEl: HTMLDivElement | null | undefined;
  imageContainerEl: HTMLDivElement | null | undefined;
  imageItemEls: NodeListOf<HTMLDivElement> | undefined;
  paddleNavEl: HTMLDivElement | null | undefined;
  btnPaddleEls: NodeListOf<HTMLButtonElement> | undefined;
  btnPaddlePreviousEl: HTMLButtonElement | null | undefined;
  btnPaddleNextEl: HTMLButtonElement | null | undefined;
  dotNavEl: HTMLDivElement | null | undefined;
  btnDotEls: NodeListOf<HTMLButtonElement> | undefined;
  thumbnailsEl: HTMLDivElement | null | undefined;
  btnThumbnailEls: NodeListOf<HTMLButtonElement> | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.imageGalleryEl = document.querySelector('#gallery') as HTMLDivElement;
    this.imageWrapEl = this.imageGalleryEl.querySelector('.image-wrap') as HTMLDivElement;
    this.imageContainerEl = this.imageWrapEl.querySelector('.image-container') as HTMLDivElement;
    this.imageItemEls = this.imageContainerEl.querySelectorAll('.image-item');
    this.paddleNavEl = this.imageGalleryEl.querySelector('.paddle-nav') as HTMLDivElement;
    this.btnPaddleEls = this.paddleNavEl.querySelectorAll('button.btn-paddle');
    this.btnPaddlePreviousEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-previous') as HTMLButtonElement;
    this.btnPaddleNextEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-next') as HTMLButtonElement;
    this.dotNavEl = this.imageGalleryEl.querySelector('.dot-nav') as HTMLDivElement;
    this.btnDotEls = this.dotNavEl.querySelectorAll('button.btn-dot');
    this.thumbnailsEl = document.querySelector('#gallery-thumbnails') as HTMLDivElement;
    this.btnThumbnailEls = this.thumbnailsEl.querySelectorAll('button.btn-thumbnail');
  }

  addEvent() {
    if (!this.btnPaddleEls || !this.btnThumbnailEls) {
      return
    }
    this.btnPaddleEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
    });
    this.btnThumbnailEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnThumbnailEl.bind(this));
    });
  }

  reset() {
    if (!this.imageItemEls) {
      return
    }
    this.cuId = 0;
    this.exId = this.cuId;
    this.max = this.imageItemEls.length;
    if (INFINITE) {
      this.setInfiniteGallery();
    }
    this.resizeGallery();
    this.changeImage();
  }

  setInfiniteGallery() {
    if (!INFINITE || !this.imageContainerEl || !this.imageItemEls || this.max === null) {
      return
    }
    const firstCloneItemEl = this.imageItemEls.item(0).cloneNode(true) as HTMLDivElement
    const lastCloneItemEl = this.imageItemEls.item(this.max - 1).cloneNode(true) as HTMLDivElement
    firstCloneItemEl.classList.add('clone');
    lastCloneItemEl.classList.add('clone');
    this.imageContainerEl.insertBefore(lastCloneItemEl, this.imageItemEls.item(0));
    this.imageContainerEl.appendChild(firstCloneItemEl);
  }

  resizeGallery() {
    if (!this.imageContainerEl || this.max === null) {
      return
    }
    this.galleryWidth = INFINITE ? IMAGE_WIDTH * (this.max + 2) : IMAGE_WIDTH * this.max;
    this.galleryHeight = IMAGE_HEIGHT;
    gsap.set(this.imageContainerEl, { width: this.galleryWidth });
  }

  autoPlayGallery() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setTimeout(this.rollingGallery.bind(this), TIME * 1000);
  }

  rollingGallery() {
    if (this.exId === null || this.max === null || this.isAni) {
      return
    }
    let id = this.exId + 1;
    if (id > this.max - 1) {
      id = 0;
    }
    if (this.exId !== id) {
      this.cuId = id;
      this.checkPaddleNav();
      this.checkThumbnails();
      this.changeImage(true);
    }
  }

  changeImage(withAni: boolean = false) {
    if (!this.imageContainerEl || this.exId === null) {
      return
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    gsap.killTweensOf(this.imageContainerEl);
    const x = INFINITE ? IMAGE_WIDTH * (this.cuId + 1) * -1 : IMAGE_WIDTH * this.cuId * -1;
    this.checkDotNav();
    if (!withAni) {
      gsap.set(this.imageContainerEl, { x });
      this.checkPaddleNav();
      this.checkThumbnails();
      this.exId = this.cuId;
      this.isAni = false;
      this.autoPlayGallery();
      return
    }
    this.isAni = true;
    const duration = BASE_DURATION + ADD_DURATION * Math.abs(this.cuId - this.exId);
    const ease = 'power2.inOut';
    gsap.to(this.imageContainerEl, {
      x, duration, ease, onComplete: () => {
        this.checkPaddleNav();
        this.checkThumbnails();
        this.exId = this.cuId;
        this.isAni = false;
        this.autoPlayGallery();
      }
    });
  }

  checkPaddleNav() {
    if (this.max === null || !this.btnPaddlePreviousEl || !this.btnPaddleNextEl) {
      return;
    }
    if (INFINITE) {
      this.btnPaddlePreviousEl.disabled = false;
      this.btnPaddleNextEl.disabled = false;
      return
    }
    if (this.cuId === 0) {
      if (!this.btnPaddlePreviousEl.disabled) {
        this.btnPaddlePreviousEl.disabled = true;
      }
      this.btnPaddleNextEl.disabled = false;
      return
    }
    if (this.cuId === this.max - 1) {
      this.btnPaddlePreviousEl.disabled = false;
      if (!this.btnPaddleNextEl.disabled) {
        this.btnPaddleNextEl.disabled = true;
      }
      return
    }
    this.btnPaddlePreviousEl.disabled = false;
    this.btnPaddleNextEl.disabled = false;
  }

  checkDotNav() {
    if (!this.btnDotEls) {
      return
    }
    this.btnDotEls.forEach((el: HTMLButtonElement, idx: number) => {
      if (idx === this.cuId) {
        if (!el.classList.contains('selected')) {
          el.classList.add('selected');
        }
        el.classList.add('selected');
        return
      }
      if (el.classList.contains('selected')) {
        el.classList.remove('selected');
      }
    });
  }

  checkThumbnails() {
    if (!this.btnThumbnailEls) {
      return
    }
    this.btnThumbnailEls.forEach((el: HTMLButtonElement, idx: number) => {
      if (idx === this.cuId) {
        if (!el.classList.contains('selected')) {
          el.classList.add('selected');
        }
        el.classList.add('selected');
        return
      }
      if (el.classList.contains('selected')) {
        el.classList.remove('selected');
      }
    });
  }

  handleClickBtnPaddleEl(e: MouseEvent) {
    e.preventDefault();
    if (this.exId === null || this.max === null || this.isAni) {
      return
    }
    const el = e.currentTarget as HTMLButtonElement;
    let id = this.exId;
    if (el.classList.contains('paddle-previous')) {
      id -= 1;
    }
    if (el.classList.contains('paddle-next')) {
      id += 1;
    }
    if (INFINITE) {
      if (id < -1) {
        id = this.max - 1;
      } else if (id > this.max) {
        id = 0;
      }
    } else {
      if (id < 0) {
        id = 0;
      } else if (id > this.max - 1) {
        id = this.max - 1;
      }
    }

    if (this.exId !== id) {
      this.cuId = id;
      this.checkPaddleNav();
      this.changeImage(true);
    }
  }

  handleClickBtnThumbnailEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni || !this.btnThumbnailEls) {
      return
    }
    const el = e.currentTarget as HTMLButtonElement;
    if (el.classList.contains('selected')) {
      return
    }
    const id = [...this.btnThumbnailEls].indexOf(el);
    if (this.exId !== id) {
      this.cuId = id;
      this.checkThumbnails();
      this.changeImage(true);
    }
  }

}


new App();
