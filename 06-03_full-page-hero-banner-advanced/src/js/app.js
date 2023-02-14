gsap.registerPlugin(TextPlugin);

const APP = {
    _layout: 'horizontal',
    _isAni: false,
    _bannerWidth: null,
    _bannerHeight: null,
    _originalImageWidth: 1200,
    _originalImageHeight: 800,
    _cuId: 0,
    _exId: null,
    _max: null,
    _cuDuration: 0.6,
    _exDuration: 1.2,
    _cuEase: 'power2.inOut',
    _exEase: 'sine.in',
    _timer: null,
    _time: 6,

    init() {
        this.layout();
        this.create();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.heroBannerEl = document.querySelector('#banner');
        this.bannerWrapEl = this.heroBannerEl.querySelector('.banner-wrap');
        this.bannerItemEls = this.bannerWrapEl.querySelectorAll('.banner-item');
        this.controlsEl = this.heroBannerEl.querySelector('.controls');
        this.pageEl = this.controlsEl.querySelector('.page')
        this.cuPageEl = this.pageEl.querySelector('span.current');
        this.maxPageEl = this.pageEl.querySelector('span.max');
        this.btnArrowEls = this.controlsEl.querySelectorAll('button.btn-arrow');
        this.dotNavEl = this.heroBannerEl.querySelector('.dot-nav');
        this.dotNavListEl = this.dotNavEl.querySelector('ul');
    },
    create() {
        this._max = this.bannerItemEls.length;
        this.dotNavListEl.innerText = '';
        [...Array(this._max).keys()].forEach((idx) => {
            const listItemEl = document.createElement('li');
            const btnDotEl = document.createElement('button');
            btnDotEl.type = 'button'
            btnDotEl.classList.add('btn-dot');
            btnDotEl.innerText = `Item ${idx}`;
            listItemEl.appendChild(btnDotEl);
            this.dotNavListEl.appendChild(listItemEl);
        });
        this.btnDotEls = this.dotNavListEl.querySelectorAll('button.btn-dot');
    },
    addEvent() {
        window.addEventListener('resize', this.handleResizeWindow.bind(this));
        this.btnArrowEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnArrowEl.bind(this));
        });
        this.btnDotEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        this._layout = this.heroBannerEl.dataset.layout;
        this.maxPageEl.innerText = this._max;
        this.checkPage();
        window.dispatchEvent(new Event('resize'));
    },
    resizeBanner() {
        const { innerWidth: width, innerHeight: height } = window
        let imageWidth = width
        let imageHeight = Math.round(this._originalImageHeight * width / this._originalImageWidth);
        if (imageHeight <= height) {
            imageHeight = height
            imageWidth = Math.round(this._originalImageWidth * height / this._originalImageHeight);
        }
        const marginTop = Math.round(height / 2 - imageHeight / 2);
        const marginLeft = Math.round(width / 2 - imageWidth / 2);
        this._bannerWidth = width;
        this._bannerHeight = height;
        gsap.set(this.heroBannerEl, { width: this._bannerWidth, height: this._bannerHeight });
        gsap.set(this.bannerItemEls, { width: this._bannerWidth, height: this._bannerHeight });
        this.bannerItemEls.forEach((el) => {
            const imageEl = el.querySelector('.image-area figure img');
            gsap.set(imageEl, { width: imageWidth, height: imageHeight, marginTop, marginLeft });
        });
    },
    autoPlayBanner() {
        clearInterval(this._timer);
        this._timer = setTimeout(this.rollingBanner.bind(this), this._time * 1000);
    },
    rollingBanner() {
        if (this._isAni) {
            return
        }
        let id = this._exId + 1;
        if (id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPage();
            this.changeItem(true);
        }
    },
    changeItem(withAni = false, direction = false) {
        clearInterval(this._timer);
        const cuItemEl = this.bannerItemEls.item(this._cuId);
        const exItemEl = this.bannerItemEls.item(this._exId);
        gsap.killTweensOf(cuItemEl);
        gsap.killTweensOf(exItemEl);
        this.checkDotNav();
        const cuPos = { startX: 0, startY: 0, endX: 0, endY: 0 }
        const exPos = { startX: 0, startY: 0, endX: 0, endY: 0 }
        if (!withAni) {
            gsap.set(cuItemEl, { x: cuPos.endX, y: cuPos.endY });
            this.checkPage();
            this._exId = this._cuId;
            this._isAni = false;
            this.autoPlayBanner();
            return
        }
        this._isAni = true;
        if (!exItemEl.classList.contains('ex')) {
            exItemEl.classList.remove('selected');
            exItemEl.classList.add('ex');
        }
        if (!cuItemEl.classList.contains('selected')) {
            cuItemEl.classList.remove('ex');
            cuItemEl.classList.add('selected');
        }
        if (this._layout === 'horizontal') {
            cuPos.startX = !direction ? this._bannerWidth : this._bannerWidth * -1;
            exPos.endX = !direction ? this._bannerWidth * -1 : this._bannerWidth;
        } else if (this._layout === 'vertical') {
            cuPos.startY = !direction ? this._bannerHeight : this._bannerHeight * -1;
            exPos.endY = !direction ? this._bannerHeight * -1 : this._bannerHeight;
        }
        gsap.set(exItemEl, { x: exPos.startX, y: exPos.startY });
        gsap.set(cuItemEl, { x: cuPos.startX, y: cuPos.startY });
        this.itemContentInit(cuItemEl);
        setTimeout(() => this.itemContentAppear(cuItemEl), this._cuDuration * 0.66 * 1000);
        gsap.to(exItemEl, { x: exPos.endX, y: exPos.endY, duration: this._exDuration, ease: this._exEase });
        gsap.to(cuItemEl, {
            x: cuPos.endX, y: cuPos.endY, duration: this._cuDuration, ease: this._cuEase, onComplete: () => {
                gsap.killTweensOf(exItemEl);
                if (exItemEl.classList.contains('ex')) {
                    exItemEl.classList.remove('ex');
                }
                gsap.set(exItemEl, { clearProps: 'transform' });
                gsap.set(cuItemEl, { clearProps: 'transform' });
                this.checkPage();
                this._exId = this._cuId;
                this._isAni = false;
                this.autoPlayBanner();
            }
        });
    },
    itemContentInit(el) {
        const eyebrowEl = el.querySelector('.eyebrow');
        const headlineEl = el.querySelector('.headline');
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

    },
    itemContentAppear(el) {
        const eyebrowEl = el.querySelector('.eyebrow');
        const headlineEl = el.querySelector('.headline');
        const headlineSpanEls = headlineEl.querySelectorAll('span');
        const copyEl = el.querySelector('.copy');
        const tl = gsap.timeline();
        tl.addLabel('first')
            .to(eyebrowEl, { x: 0, autoAlpha: 1, duration: 0.15, ease: 'sine.out' })
            .addLabel('second', '-=0.1')
            .to(headlineEl, { x: 0, autoAlpha: 1, duration: 0.2, ease: 'sine.inOut' }, 'second')
            .addLabel('third', '-=0.05')
            .to(headlineSpanEls, {
                text: (i, spanEl) => {
                    return spanEl.dataset.text
                },
                duration: (idx, spanEl) => {
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
    },
    checkPage() {
        this.cuPageEl.innerText = this._cuId + 1;
    },
    checkDotNav() {
        this.btnDotEls.forEach((el, idx) => {
            if (idx === this._cuId) {
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
    },
    handleResizeWindow() {
        clearInterval(this._timer);
        this.resizeBanner();
        this.changeItem();
    },
    handleClickBtnArrowEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        let id = this._exId;
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
            id = this._max - 1;
        } else if (id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPage();
            this.changeItem(true, direction);
        }
    },
    handleClickBtnDotEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        if (el.classList.contains('selected')) {
            return
        }
        const id = [...this.btnDotEls].indexOf(el);
        if (this._exId !== id) {
            this._cuId = id;
            this.changeItem(true);
        }
    }
}

APP.init();
