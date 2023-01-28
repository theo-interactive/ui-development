const THEMES = ['light', 'dark', 'red', 'green'];

const APP = {
  _theme: 'light',

  init() {
    this.layout();
    this.addEvent();
    this.reset();
  },
  layout() {
    this.themeNameEl = document.querySelector('#theme-name');
    this.themeMenuEl = document.querySelector('#theme-menu');
    this.themeMenuListEl = this.themeMenuEl.querySelector('ul');
    this.themeMenuItemEls = this.themeMenuListEl.querySelectorAll('li');
    this.btnThemeMenuEls = this.themeMenuEl.querySelectorAll('li > a');
  },
  addEvent() {
    this.btnThemeMenuEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnThemeMenuEl.bind(this));
    });
  },
  reset() {
    this.setTheme();
  },
  setTheme() {
    const { documentElement: htmlEl } = document
    THEMES.forEach((theme) => {
      htmlEl.classList.remove(`theme-${theme}`);
    });
    htmlEl.classList.add(`theme-${this._theme}`);
    this.themeNameEl.innerText = this._theme;
  },
  handleClickBtnThemeMenuEl(e) {
    e.preventDefault();
    const el = e.currentTarget
    const parentEl = el.parentElement;
    const theme = el.getAttribute('href').replace('#', '');
    if (!parentEl.classList.contains('selected')) {
      this.themeMenuItemEls.forEach((itemEl) => {
        itemEl.classList.remove('selected');
      });
      parentEl.classList.add('selected');
      this._theme = theme
      this.setTheme();
    }
  }
}

APP.init()
