const APP = {
    _breakPointMobile: 834,
    _isOpenMenu: false,
    _isAni: false,
    _duration: 500,

    init() {
        this.layout();
        this.addEvent();
    },
    layout() {
        this.bodyEl = document.body;
        this.gnEl = document.querySelector('#global-navigation');
        this.gnLogoEl = this.gnEl.querySelector('#gn-logo');
        this.gnMenuEl = this.gnEl.querySelector('#gn-menu');
        this.gnMenuLinkEls = this.gnMenuEl.querySelectorAll('#gn-menu-list li.gn-item > a.gn-link');
        this.btnMenuEl = this.gnEl.querySelector('button#btn-menu');
        this.btnMenuSpanEl = this.btnMenuEl.querySelector('span');
    },
    addEvent() {
        window.addEventListener('resize', this.handleResizeWindow.bind(this));
        this.gnLogoEl.addEventListener('click', this.handleClickGNLogoEl.bind(this));
        this.gnMenuLinkEls.forEach((el) => {
            el.addEventListener('click', this.handleClickGNMenuLinkEl.bind(this));
        })
        this.btnMenuEl.addEventListener('click', this.handleClickBtnMenuEl.bind(this));
    },
    setMenuView() {
        if (this._isAni) {
            return
        }
        this._isAni = true;
        if (!this._isOpenMenu) {
            this._isOpenMenu = true;
            this.changeMenuSpan(true);
            this.gnEl.classList.add('menu-open', 'menu-open-ani');
            this.bodyEl.classList.add('gn-noscroll');
            setTimeout(() => {
                this._isAni = false;
                this.gnEl.classList.remove('menu-open-ani');
            }, this._duration);
            return
        }
        this._isOpenMenu = false;
        this.changeMenuSpan();
        this.gnEl.classList.remove('menu-open');
        this.gnEl.classList.add('menu-close-ani');
        setTimeout(() => {
            this._isAni = false;
            this.bodyEl.classList.remove('gn-noscroll');
            this.gnEl.classList.remove('menu-close-ani');
        }, this._duration);
    },
    changeMenuSpan(isOpen = false) {
        if (!isOpen) {
            this.btnMenuSpanEl.innerHTML = 'Menu';
            return
        }
        this.btnMenuSpanEl.innerHTML = 'Close';
    },
    handleResizeWindow() {
        const {innerWidth: width} = window;
        if (width >= this._breakPointMobile) {
            if (this._isOpenMenu) {
                this.setMenuView();
            }
        }
    },
    handleClickGNLogoEl(e) {
        e.preventDefault();
    },
    handleClickGNMenuLinkEl(e) {
        e.preventDefault();
    },
    handleClickBtnMenuEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        this.setMenuView();
    }
}

APP.init();
