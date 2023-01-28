const APP = {
  _cuId: 0,
  _exId: null,
  _isAni: false,

  init() {
    this.layout();
    this.addEvent();
    this.reset();
  },
  layout() {
    this.btnTabMenuEls = document.querySelectorAll('#tab-menu li a');
    this.tabContentEls = document.querySelectorAll('#tab-contents .tab-content');
  },
  addEvent() {
    this.btnTabMenuEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnTabMenuEl.bind(this));
    });
  },
  reset() {
    this._cuId = 0;
    this._exId = this._cuId;
  },
  handleClickBtnTabMenuEl(e) {
    e.preventDefault();
    if (this._isAni) {
      return
    }
    const el = e.currentTarget;
    if (el.classList.contains('selected')) {
      return
    }
    const id = [...this.btnTabMenuEls].indexOf(el);
    if (this._exId !== null) {
      this.btnTabMenuEls[this._exId].classList.remove('selected');
      this.tabContentEls[this._exId].classList.remove('selected');
    }
    this._cuId = id;
    this._isAni = true;
    this.btnTabMenuEls[this._cuId].classList.add('selected');
    this.tabContentEls[this._cuId].classList.add('selected');
    this._isAni = false;
    this._exId = this._cuId;
  }
}

APP.init();
