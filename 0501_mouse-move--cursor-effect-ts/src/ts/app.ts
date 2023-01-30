import gsap from 'gsap';

class App {

  btnListEls: NodeListOf<HTMLAnchorElement> | undefined;
  cursorDotEl: HTMLDivElement | null | undefined;
  cursorBGEl: HTMLDivElement | null | undefined;
  selectEl: HTMLDivElement | null | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.btnListEls = document.querySelectorAll('#image-list li a');
    this.cursorDotEl = document.querySelector('#cursor-dot') as HTMLDivElement;
    this.cursorBGEl = document.querySelector('#cursor-bg') as HTMLDivElement;
    this.selectEl = document.querySelector('#select') as HTMLDivElement;
  }

  addEvent() {
    if (!this.btnListEls) {
      return
    }
    window.addEventListener('mousemove', this.handleMouseMoveWindow.bind(this));
    this.btnListEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnListEl.bind(this));
      el.addEventListener('mouseenter', this.handleMouseEnterBtnListEl.bind(this));
      el.addEventListener('mouseleave', this.handleMouseLeaveBtnListEl.bind(this));
    })
  }

  reset() {
    this.resetAnchor();
  }

  resetAnchor() {
    if (!this.cursorDotEl
      || !this.cursorBGEl
      || !this.selectEl) {
      return
    }
    gsap.killTweensOf(this.cursorDotEl);
    gsap.killTweensOf(this.cursorBGEl);
    gsap.killTweensOf(this.selectEl);
  }

  handleMouseMoveWindow(e: MouseEvent) {
    if (!this.cursorDotEl
      || !this.cursorBGEl
      || !this.selectEl) {
      return
    }
    const { pageY: top, pageX: left } = e;
    this.resetAnchor();
    gsap.to(this.cursorDotEl, { top, left, duration: 0.1 });
    gsap.to(this.cursorBGEl, { top, left, duration: 0.3, ease: 'sine.out' });
    gsap.to(this.selectEl, { top, left, duration: 0.25, ease: 'sine.out' });
  }

  handleClickBtnListEl(e: MouseEvent) {
    e.preventDefault();
  }

  handleMouseEnterBtnListEl() {
    if (!this.cursorBGEl || !this.selectEl) {
      return
    }
    if (!this.cursorBGEl.classList.contains('active')) {
      this.cursorBGEl.classList.add('active');
    }
    if (!this.selectEl.classList.contains('active')) {
      this.selectEl.classList.add('active');
    }
  }

  handleMouseLeaveBtnListEl() {
    if (!this.cursorBGEl || !this.selectEl) {
      return
    }
    if (this.cursorBGEl.classList.contains('active')) {
      this.cursorBGEl.classList.remove('active');
    }
    if (this.selectEl.classList.contains('active')) {
      this.selectEl.classList.remove('active');
    }
  }
}

new App();
