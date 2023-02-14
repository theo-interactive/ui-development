import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin'

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min';

gsap.registerPlugin(TextPlugin);

enum LayoutType {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

type Pos = {
  startX: number
  startY: number
  endX: number
  endY: number
}

const ORIGINAL_IMAGE_WIDTH: number = 1200;
const ORIGINAL_IMAGE_HEIGHT: number = 800;
const CU_DURATION: number = 0.6;
const EX_DURATION: number = 1.2;
const CU_EASE: string = 'power2.inOut';
const EX_EASE: string = 'sine.in';
const TIME: number = 6;

class App {

  layoutType: LayoutType = LayoutType.horizontal;
  isAni: boolean = false;
  bannerWidth: number | null = null;
  bannerHeight: number | null = null;
  cuId: number = 0;
  exId: number | null = null;
  max: number | null = null;
  timer: number | null = null;

  heroBannerEl: HTMLDivElement | null | undefined;
  bannerWrapEl: HTMLDivElement | null | undefined;
  bannerItemEls: NodeListOf<HTMLDivElement> | undefined;
  controlsEl: HTMLDivElement | null | undefined;
  pageEl: HTMLDivElement | null | undefined;
  cuPageEl: HTMLSpanElement | null | undefined;
  maxPageEl: HTMLSpanElement | null | undefined;
  btnArrowEls: NodeListOf<HTMLButtonElement> | undefined;
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
    this.bannerItemEls = this.bannerWrapEl.querySelectorAll('.banner-item');
    this.controlsEl = this.heroBannerEl.querySelector('.controls') as HTMLDivElement;
    this.pageEl = this.controlsEl.querySelector('.page') as HTMLDivElement;
    this.cuPageEl = this.pageEl.querySelector('span.current') as HTMLSpanElement
    this.maxPageEl = this.pageEl.querySelector('span.max') as HTMLSpanElement;
    this.btnArrowEls = this.controlsEl.querySelectorAll('button.btn-arrow');
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
    if (!this.btnArrowEls || !this.btnDotEls) {
      return
    }
    window.addEventListener('resize', this.handleResizeWindow.bind(this));
    this.btnArrowEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnArrowEl.bind(this));
    });
    this.btnDotEls.forEach((el: HTMLButtonElement) => {
      el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
    });
  }

  reset() {
    if (!this.heroBannerEl || !this.maxPageEl) {
      return
    }
    this.cuId = 0;
    this.exId = this.cuId;
    this.layoutType = this.heroBannerEl.dataset.layout as LayoutType;
    this.maxPageEl.innerText = `${this.max}`;
    this.checkPage();
    window.dispatchEvent(new Event('resize'));
  }

  resizeBanner() {
    if (this.max === null || !this.heroBannerEl || !this.bannerItemEls) {
      return
    }
    const { innerWidth: width, innerHeight: height } = window
    let imageWidth = width
    let imageHeight = Math.round(ORIGINAL_IMAGE_HEIGHT * width / ORIGINAL_IMAGE_WIDTH);
    if (imageHeight <= height) {
      imageHeight = height
      imageWidth = Math.round(ORIGINAL_IMAGE_WIDTH * height / ORIGINAL_IMAGE_HEIGHT);
    }
    const marginTop = Math.round(height / 2 - imageHeight / 2);
    const marginLeft = Math.round(width / 2 - imageWidth / 2);
    this.bannerWidth = width;
    this.bannerHeight = height;
    gsap.set(this.heroBannerEl, { width: this.bannerWidth, height: this.bannerHeight });
    gsap.set(this.bannerItemEls, { width: this.bannerWidth, height: this.bannerHeight });
    this.bannerItemEls.forEach((el) => {
      const imageEl = el.querySelector('.image-area figure img');
      gsap.set(imageEl, { width: imageWidth, height: imageHeight, marginTop, marginLeft });
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
    if (id > this.max - 1) {
      id = 0;
    }
    if (this.exId !== id) {
      this.cuId = id;
      this.checkPage();
      this.changeItem(true);
    }
  }

  changeItem(withAni: boolean = false, direction: boolean = false) {
    if (this.bannerWidth === null || this.bannerHeight === null || this.exId === null || this.max === null || !this.bannerItemEls) {
      return
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    const cuItemEl = this.bannerItemEls.item(this.cuId);
    const exItemEl = this.bannerItemEls.item(this.exId);
    gsap.killTweensOf(cuItemEl);
    gsap.killTweensOf(exItemEl);
    this.checkDotNav();
    const cuPos: Pos = { startX: 0, startY: 0, endX: 0, endY: 0 }
    const exPos: Pos = { startX: 0, startY: 0, endX: 0, endY: 0 }
    if (!withAni) {
      gsap.set(cuItemEl, { x: cuPos.endX, y: cuPos.endY });
      this.checkPage();
      this.exId = this.cuId;
      this.isAni = false;
      this.autoPlayBanner();
      return
    }
    this.isAni = true;
    if (!exItemEl.classList.contains('ex')) {
      exItemEl.classList.remove('selected');
      exItemEl.classList.add('ex');
    }
    if (!cuItemEl.classList.contains('selected')) {
      cuItemEl.classList.remove('ex');
      cuItemEl.classList.add('selected');
    }
    if (this.layoutType === 'horizontal') {
      cuPos.startX = !direction ? this.bannerWidth : this.bannerWidth * -1;
      exPos.endX = !direction ? this.bannerWidth * -1 : this.bannerWidth;
    } else if (this.layoutType === 'vertical') {
      cuPos.startY = !direction ? this.bannerHeight : this.bannerHeight * -1;
      exPos.endY = !direction ? this.bannerHeight * -1 : this.bannerHeight;
    }
    gsap.set(exItemEl, { x: exPos.startX, y: exPos.startY });
    gsap.set(cuItemEl, { x: cuPos.startX, y: cuPos.startY });
    this.itemContentInit(cuItemEl);
    setTimeout(() => this.itemContentAppear(cuItemEl), CU_DURATION * 0.66 * 1000);
    gsap.to(exItemEl, { x: exPos.endX, y: exPos.endY, duration: EX_DURATION, ease: EX_EASE });
    gsap.to(cuItemEl, {
      x: cuPos.endX, y: cuPos.endY, duration: CU_DURATION, ease: CU_EASE, onComplete: () => {
        gsap.killTweensOf(exItemEl);
        if (exItemEl.classList.contains('ex')) {
          exItemEl.classList.remove('ex');
        }
        gsap.set(exItemEl, { clearProps: 'transform' });
        gsap.set(cuItemEl, { clearProps: 'transform' });
        this.checkPage();
        this.exId = this.cuId;
        this.isAni = false;
        this.autoPlayBanner();
      }
    });
  }

  itemContentInit(el: HTMLDivElement) {
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
  }

  itemContentAppear(el: HTMLDivElement) {
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
    });
  }

  checkPage() {
    if (!this.cuPageEl) {
      return
    }
    this.cuPageEl.innerText = `${this.cuId + 1}`;
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

  handleClickBtnArrowEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni || this.exId === null || this.max === null) {
      return
    }
    const el = e.currentTarget as HTMLButtonElement;
    let id = this.exId;
    let direction = false;
    if (el.classList.contains('arrow-previous')) {
      id -= 1;
      direction = true;
    }
    if (el.classList.contains('arrow-next')) {
      id += 1;
      direction = false;
    }
    if (id < 0) {
      id = this.max - 1;
    } else if (id > this.max - 1) {
      id = 0;
    }
    if (this.exId !== id) {
      this.cuId = id;
      this.checkPage();
      this.changeItem(true, direction);
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
