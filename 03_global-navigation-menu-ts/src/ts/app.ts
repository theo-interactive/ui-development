const BREAK_POINT_MOBILE = 834
const DURATION = 500

class App {

  isOpenMenu: boolean = false
  isAni: boolean = false

  bodyEl: HTMLBodyElement | null | undefined;
  gnEl: HTMLElement | null | undefined;
  gnLogoEl: HTMLHeadingElement | null | undefined;
  gnMenuEl: HTMLDivElement | null | undefined;
  gnMenuLinkEls: NodeListOf<HTMLAnchorElement> | undefined;
  btnMenuEl: HTMLButtonElement | null | undefined;
  btnMenuSpanEl: HTMLSpanElement | null | undefined;

  constructor() {
    this.layout();
    this.addEvent();
  }

  layout() {
    this.bodyEl = document.body as HTMLBodyElement;
    this.gnEl = document.querySelector('#global-navigation') as HTMLElement;
    this.gnLogoEl = this.gnEl.querySelector('#gn-logo') as HTMLHeadingElement;
    this.gnMenuEl = this.gnEl.querySelector('#gn-menu') as HTMLDivElement;
    this.gnMenuLinkEls = this.gnMenuEl.querySelectorAll('#gn-menu-list li.gn-item a.gn-link');
    this.btnMenuEl = this.gnEl.querySelector('button#btn-menu') as HTMLButtonElement;
    this.btnMenuSpanEl = this.btnMenuEl.querySelector('span') as HTMLSpanElement;
  }

  addEvent() {
    if (!this.gnLogoEl || !this.gnMenuLinkEls || !this.btnMenuEl) {
      return
    }
    window.addEventListener('resize', this.handleResizeWindow.bind(this));
    this.gnLogoEl.addEventListener('click', this.handleClickGNLogoEl.bind(this));
    this.gnMenuLinkEls.forEach((el) => {
      el.addEventListener('click', this.handleClickGNMenuLinkEl.bind(this));
    })
    this.btnMenuEl.addEventListener('click', this.handleClickBtnMenuEl.bind(this));
  }

  setMenuView() {
    if (!this.bodyEl || !this.gnEl || this.isAni) {
      return
    }
    this.isAni = true;
    if (!this.isOpenMenu) {
      this.isOpenMenu = true;
      this.changeMenuSpan(true);
      this.gnEl.classList.add('menu-open', 'menu-open-ani');
      this.bodyEl.classList.add('gn-noscroll');
      setTimeout(() => {
        if (!this.gnEl) {
          return
        }
        this.isAni = false;
        this.gnEl.classList.remove('menu-open-ani');
      }, DURATION);
      return
    }
    this.isOpenMenu = false;
    this.changeMenuSpan();
    this.gnEl.classList.remove('menu-open');
    this.gnEl.classList.add('menu-close-ani');
    setTimeout(() => {
      if (!this.bodyEl || !this.gnEl) {
        return
      }
      this.isAni = false;
      this.bodyEl.classList.remove('gn-noscroll');
      this.gnEl.classList.remove('menu-close-ani');
    }, DURATION);
  }

  changeMenuSpan(isOpen = false) {
    if (!this.btnMenuSpanEl) {
      return
    }
    if (!isOpen) {
      this.btnMenuSpanEl.innerHTML = 'Menu';
      return
    }
    this.btnMenuSpanEl.innerHTML = 'Close';
  }

  handleResizeWindow() {
    const {innerWidth: width} = window;
    if (width >= BREAK_POINT_MOBILE) {
      if (this.isOpenMenu) {
        this.setMenuView();
      }
    }
  }

  handleClickGNLogoEl(e: MouseEvent) {
    e.preventDefault();
  }

  handleClickGNMenuLinkEl(e: MouseEvent) {
    e.preventDefault();
  }

  handleClickBtnMenuEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni) {
      return
    }
    this.setMenuView();
  }

}

new App();
