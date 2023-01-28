const THEMES: string[] = ['light', 'dark', 'red', 'green'];

class App {

  theme: string = THEMES[0];
  themeNameEl: HTMLSpanElement | null | undefined;
  themeMenuEl: HTMLDivElement | null | undefined;
  themeMenuListEl: HTMLUListElement | null | undefined;
  themeMenuItemEls: NodeListOf<HTMLLIElement> | undefined;
  btnThemeMenuEls: NodeListOf<HTMLAnchorElement> | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.themeNameEl = document.querySelector('#theme-name') as HTMLSpanElement;
    this.themeMenuEl = document.querySelector('#theme-menu') as HTMLDivElement;
    this.themeMenuListEl = this.themeMenuEl.querySelector('ul') as HTMLUListElement;
    this.themeMenuItemEls = this.themeMenuListEl.querySelectorAll('li');
    this.btnThemeMenuEls = this.themeMenuEl.querySelectorAll('li > a');
  }

  addEvent() {
    if (!this.btnThemeMenuEls) {
      return
    }
    this.btnThemeMenuEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnThemeMenuEl.bind(this));
    });
  }

  reset() {
    this.setTheme();
  }

  setTheme() {
    if (!this.themeNameEl) {
      return
    }
    const { documentElement: htmlEl } = document;
    THEMES.forEach((theme) => {
      htmlEl.classList.remove(`theme-${theme}`);
    });
    htmlEl.classList.add(`theme-${this.theme}`);
    this.themeNameEl.innerText = this.theme;
  }

  handleClickBtnThemeMenuEl(e: MouseEvent) {
    e.preventDefault();
    if (!this.btnThemeMenuEls || !this.themeMenuItemEls) {
      return
    }
    const el: HTMLAnchorElement = e.currentTarget as HTMLAnchorElement;
    const parentEl: HTMLLIElement = el.parentElement as HTMLLIElement;
    const theme: string = el.getAttribute('href')!.replace('#', '');
    if (!parentEl.classList.contains('selected')) {
      this.themeMenuItemEls.forEach((itemEl) => {
        itemEl.classList.remove('selected');
      });
      parentEl.classList.add('selected');
      this.theme = theme
      this.setTheme();
    }
  }

}

new App();
