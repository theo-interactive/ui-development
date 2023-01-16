const MODES: string[] = ['light', 'dark', 'red', 'green'];

class App {

  mode: string = MODES[0];
  modeNameEl: HTMLSpanElement | null | undefined;
  modeMenuListItemEls: NodeListOf<HTMLLIElement> | undefined
  btnModeMenuEls: NodeListOf<HTMLAnchorElement> | undefined

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.modeNameEl = document.querySelector('h1.headline span.mode-name') as HTMLSpanElement;
    this.modeMenuListItemEls = document.querySelectorAll('#mode-menu li');
    this.btnModeMenuEls = document.querySelectorAll('#mode-menu li > a');
  }

  addEvent() {
    if (!this.btnModeMenuEls) {
      return
    }
    this.btnModeMenuEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnModeMenuEl.bind(this));
    })
  }

  reset() {
    this.setMode();
  }

  setMode() {
    if (!this.modeNameEl) {
      return
    }
    const { documentElement: htmlEl } = document
    MODES.forEach((mode) => {
      htmlEl.classList.remove(`mode-${mode}`);
    });
    htmlEl.classList.add(`mode-${this.mode}`);
    this.modeNameEl.innerText = this.mode
  }

  handleClickBtnModeMenuEl(e: MouseEvent) {
    e.preventDefault();
    if (!this.btnModeMenuEls || !this.modeMenuListItemEls) {
      return
    }
    const el: HTMLAnchorElement = e.currentTarget as HTMLAnchorElement;
    const parentEl: HTMLLIElement = el.parentElement as HTMLLIElement;
    if (!parentEl || parentEl.classList.contains('selected')) {
      return
    }
    const mode: string = el.getAttribute('href')!.replace('#', '');
    if (mode !== this.mode) {
      this.mode = mode;
      this.modeMenuListItemEls.forEach((listItemEl) => {
        listItemEl.classList.remove('selected');
      });
      parentEl.classList.add('selected');
      this.setMode();
    }
  }

}

new App();
