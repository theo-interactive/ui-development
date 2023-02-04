import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin'

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min';

gsap.registerPlugin(TextPlugin);

const INFINITE: boolean = true;
const ORIGINAL_IMAGE_WIDTH: number = 1200;
const ORIGINAL_IMAGE_HEIGHT: number = 800;
const BASE_DURATION: number = 0.3;
const ADD_DURATION: number = 0.1;
const TIME: number = 6;

class App {

  isAni: boolean = false;
  bannerWidth: number | null = null;
  bannerHeight: number | null = null;
  containerWidth: number | null = null;
  imageWidth: number | null = null;
  imageHeight: number | null = null;
  cuId: number = 0;
  exId: number | null = null;
  max: number | null = null;
  timer: number | null = null;

  heroBannerEl: HTMLDivElement | null | undefined;
  bannerWrapEl: HTMLDivElement | null | undefined;
  bannerContainerEl: HTMLDivElement | null | undefined;
  bannerItemEls: NodeListOf<HTMLDivElement> | undefined;
  paddleNavEl: HTMLDivElement | null | undefined;
  btnPaddleEls: NodeListOf<HTMLButtonElement> | undefined;
  btnPaddlePreviousEl: HTMLButtonElement | null | undefined;
  btnPaddleNextEl: HTMLButtonElement | null | undefined;
  dotNavEl: HTMLDivElement | null | undefined;
  dotNavListEl: HTMLUListElement | null | undefined;
  btnDotEls: NodeListOf<HTMLButtonElement> | undefined;

  constructor() {
    this.layout();
    this.create();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.heroBannerEl = document.querySelector('#banner') as HTMLDivElement;
    this.bannerWrapEl = this.heroBannerEl.querySelector('.banner-wrap') as HTMLDivElement;
    this.bannerContainerEl = this.bannerWrapEl.querySelector('.banner-container') as HTMLDivElement;
    this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
    this.paddleNavEl = this.heroBannerEl.querySelector('.paddle-nav') as HTMLDivElement;
    this.btnPaddleEls = this.paddleNavEl.querySelectorAll('button.btn-paddle');
    this.btnPaddlePreviousEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-previous') as HTMLButtonElement;
    this.btnPaddleNextEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-next') as HTMLButtonElement;
    this.dotNavEl = this.heroBannerEl.querySelector('.dot-nav') as HTMLDivElement;
    this.dotNavListEl = this.dotNavEl.querySelector('ul');
  }

  create() {
    if (!this.bannerItemEls || !this.dotNavListEl) {
      return
    }
    this.max = this.bannerItemEls.length;
    this.dotNavListEl.innerText = '';
    [...Array(this.max).keys()].forEach((idx: number) => {
      if (!this.dotNavListEl) {
        return
      }
      const listItemEl = document.createElement('li');
      const btnDotEl = document.createElement('button');
      btnDotEl.type = 'button'
      btnDotEl.classList.add('btn-dot');
      btnDotEl.innerText = `Item ${idx}`;
      listItemEl.appendChild(btnDotEl);
      this.dotNavListEl.appendChild(listItemEl);
    });
    this.btnDotEls = this.dotNavListEl.querySelectorAll('button.btn-dot');
  }

  addEvent() {
    if (!this.btnPaddleEls || !this.btnDotEls) {
      return
    }
    window.addEventListener('resize', this.handleResizeWindow.bind(this));
    this.btnPaddleEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
    });
    this.btnDotEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
    });
  }

  reset() {
    this.cuId = 0;
    this.exId = this.cuId;
    if (INFINITE) {
      this.setInfiniteBanner();
    }
    // this.resizeBanner();
    // this.changeItem();
    window.dispatchEvent(new Event('resize'));
  }

  setInfiniteBanner() {
    if (!INFINITE || this.max === null || !this.bannerContainerEl || !this.bannerItemEls) {
      return
    }
    const firstCloneItemEl = this.bannerItemEls.item(0).cloneNode(true) as HTMLDivElement;
    const lastCloneItemEl = this.bannerItemEls.item(this.max - 1).cloneNode(true) as HTMLDivElement;
    firstCloneItemEl.classList.add('clone');
    lastCloneItemEl.classList.add('clone');
    this.bannerContainerEl.insertBefore(lastCloneItemEl, this.bannerItemEls.item(0));
    this.bannerContainerEl.appendChild(firstCloneItemEl);
    this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
  }

  resizeBanner() {
    if (this.max === null || !this.heroBannerEl || !this.bannerContainerEl || !this.bannerItemEls) {
      return
    }
    const { innerWidth: width, innerHeight: height } = window
    this.imageWidth = width
    this.imageHeight = Math.round(ORIGINAL_IMAGE_HEIGHT * width / ORIGINAL_IMAGE_WIDTH);
    if (this.imageHeight <= height) {
      this.imageHeight = height
      this.imageWidth = Math.round(ORIGINAL_IMAGE_WIDTH * height / ORIGINAL_IMAGE_HEIGHT);
    }
    const marginTop = Math.round(height / 2 - this.imageHeight / 2);
    const marginLeft = Math.round(width / 2 - this.imageWidth / 2);
    this.bannerWidth = width;
    this.bannerHeight = height;
    this.containerWidth = INFINITE ? this.bannerWidth * (this.max + 2) : this.bannerWidth * this.max;
    gsap.set(this.heroBannerEl, { width: this.bannerWidth, height: this.bannerHeight });
    gsap.set(this.bannerContainerEl, { width: this.containerWidth, height: this.bannerHeight });
    gsap.set(this.bannerItemEls, { width: this.bannerWidth, height: this.bannerHeight });
    this.bannerItemEls.forEach((el) => {
      if (this.imageWidth === null || this.imageHeight === null) {
        return
      }
      const imageEl = el.querySelector('.image-area figure img');
      gsap.set(imageEl, { width: this.imageWidth, height: this.imageHeight, marginTop, marginLeft });
    });
  }

  autoPlayBanner() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setTimeout(this.rollingBanner.bind(this), TIME * 1000);
  }

  rollingBanner() {
    if (this.isAni || this.exId === null || this.max === null) {
      return
    }
    let id = this.exId + 1;
    if (!INFINITE && id > this.max - 1) {
      id = 0;
    }
    if (this.exId !== id) {
      this.cuId = id;
      this.checkPaddleNav();
      this.changeItem(true);
    }
  }

  changeItem(withAni: boolean = false) {
    if (this.bannerWidth === null || this.exId === null || this.max === null || !this.bannerContainerEl || !this.bannerItemEls) {
      return
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    gsap.killTweensOf(this.bannerContainerEl);
    let x = INFINITE ? this.bannerWidth * (this.cuId + 1) * -1 : this.bannerWidth * this.cuId * -1;
    const duration = BASE_DURATION + ADD_DURATION * Math.abs(this.cuId - this.exId);
    let cloneItemEl: HTMLDivElement | null = null
    if (INFINITE) {
      if (this.cuId < 0) {
        cloneItemEl = this.bannerItemEls.item(0);
        this.cuId = this.max - 1;
      } else if (this.cuId > this.max - 1) {
        cloneItemEl = this.bannerItemEls.item(this.max + 1);
        this.cuId = 0
      }
    }
    this.checkDotNav();
    if (!withAni) {
      gsap.set(this.bannerContainerEl, { x });
      this.checkPaddleNav();
      this.exId = this.cuId;
      this.isAni = false;
      this.autoPlayBanner();
      return
    }
    this.isAni = true;
    const itemEl = INFINITE ? this.bannerItemEls.item(this.cuId + 1) : this.bannerItemEls.item(this.cuId);
    this.itemContentInit(itemEl, cloneItemEl);
    gsap.to(this.bannerContainerEl, {
      x, duration, ease: 'power2.inOut', onComplete: () => {
        if (this.bannerWidth === null || !this.bannerContainerEl) {
          return
        }
        if (INFINITE) {
          x = this.bannerWidth * (this.cuId + 1) * -1
          gsap.set(this.bannerContainerEl,  { x })
        }
        this.checkPaddleNav();
        this.itemContentAppear(itemEl, cloneItemEl, () => {
          this.exId = this.cuId;
          this.isAni = false;
          this.autoPlayBanner();
        });
      }
    });
  }

  itemContentInit(el: HTMLDivElement, cloneEl: HTMLDivElement | null = null) {
    const eyebrowEl = el.querySelector('.eyebrow');
    const headlineEl = el.querySelector('.headline') as HTMLHeadingElement;
    const headlineSpanEls = headlineEl.querySelectorAll('span');
    const copyEl = el.querySelector('.copy');
    gsap.set(eyebrowEl, { x: 20, autoAlpha: 0 });
    headlineSpanEls.forEach((spanEl) => {
      spanEl.classList.remove('active');
      spanEl.dataset.text = spanEl.innerText
    });
    gsap.set(headlineSpanEls, { text: '' });
    gsap.set(headlineEl, { x: 40, autoAlpha: 0 });
    gsap.set(copyEl, { y: 20, autoAlpha: 0 });
    if (cloneEl !== null) {
      const cloneEyebrowEl = cloneEl.querySelector('.eyebrow');
      const cloneHeadlineEl = cloneEl.querySelector('.headline');
      const cloneCopyEl = cloneEl.querySelector('.copy');
      gsap.set(cloneEyebrowEl, { autoAlpha: 0 });
      gsap.set(cloneHeadlineEl, { autoAlpha: 0 });
      gsap.set(cloneCopyEl, { autoAlpha: 0 });
    }
  }

  itemContentAppear(el: HTMLDivElement, cloneEl: HTMLDivElement | null = null, callback: () => void) {
    const eyebrowEl = el.querySelector('.eyebrow');
    const headlineEl = el.querySelector('.headline') as HTMLHeadingElement;
    const headlineSpanEls = headlineEl.querySelectorAll('span');
    const copyEl = el.querySelector('.copy');
    const tl = gsap.timeline();
    // @ts-ignore;
    tl.addLabel('first')
      .to(eyebrowEl, { x: 0, autoAlpha: 1, duration: 0.15, ease: 'sine.out' })
      .addLabel('second', '-=0.1')
      .to(headlineEl, { x: 0, autoAlpha: 1, duration: 0.2, ease: 'sine.inOut' }, 'second')
      .addLabel('third', '-=0.05')
      .to(headlineSpanEls, {
        text: (idx: number, spanEl: any) => {
          return spanEl.dataset.text
        },
        duration: (idx: number, spanEl: any) => {
          return spanEl.dataset.text.length * 0.02
        },
        stagger: 0.1,
        onComplete: () => {
          headlineSpanEls.forEach((spanEl) => {
            spanEl.classList.add('active');
          });
        }
      }, 'second')
      .to(copyEl, { y: 0, autoAlpha: 1, duration: 0.2, ease: 'circ.out' }, 'third')
    tl.eventCallback('onComplete', () => {
      gsap.set(eyebrowEl, { clearProps: 'all' });
      gsap.set(headlineEl, { clearProps: 'all' });
      gsap.set(headlineSpanEls, { clearProps: 'all' });
      gsap.set(copyEl, { clearProps: 'all' });
      if (cloneEl !== null) {
        const cloneEyebrowEl = cloneEl.querySelector('.eyebrow');
        const cloneHeadlineEl = cloneEl.querySelector('.headline');
        const cloneCopyEl = cloneEl.querySelector('.copy');
        gsap.set(cloneEyebrowEl, { clearProps: 'all' });
        gsap.set(cloneHeadlineEl, { clearProps: 'all' });
        gsap.set(cloneCopyEl, { clearProps: 'all' });
      }
      if (callback) {
        callback();
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

  handleResizeWindow() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.resizeBanner();
    this.changeItem();
  }

  handleClickBtnPaddleEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni || this.exId === null || this.max === null) {
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
      this.changeItem(true);
    }
  }

  handleClickBtnDotEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni || !this.btnDotEls) {
      return
    }
    const el = e.currentTarget as HTMLButtonElement;
    if (el.classList.contains('selected')) {
      return
    }
    const id = [...this.btnDotEls].indexOf(el);
    if (this.exId !== id) {
      this.cuId = id;
      this.changeItem(true);
    }
  }

}


new App();
