gsap.registerPlugin(TextPlugin);

const APP = {
    _infinite: true,
    _isAni: false,
    _bannerWidth: null,
    _bannerHeight: null,
    _containerWidth: null,
    _imageWidth: null,
    _imageHeight: null,
    _originalImageWidth: 1200,
    _originalImageHeight: 800,
    _baseDuration: 0.3,
    _addDuration: 0.1,
    _cuId: 0,
    _exId: null,
    _max: null,
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
        this.bannerContainerEl = this.bannerWrapEl.querySelector('.banner-container');
        this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
        this.paddleNavEl = this.heroBannerEl.querySelector('.paddle-nav');
        this.btnPaddleEls = this.paddleNavEl.querySelectorAll('button.btn-paddle');
        this.btnPaddlePreviousEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-previous');
        this.btnPaddleNextEl = this.paddleNavEl.querySelector('button.btn-paddle.paddle-next');
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
        this.btnPaddleEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnPaddleEl.bind(this));
        });
        this.btnDotEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnDotEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
        if (this._infinite) {
            this.setInfiniteBanner();
        }
        // this.resizeBanner();
        // this.changeItem();
        window.dispatchEvent(new Event('resize'));
    },
    setInfiniteBanner() {
        if (!this._infinite) {
            return
        }
        const firstCloneItemEl = this.bannerItemEls.item(0).cloneNode(true)
        const lastCloneItemEl = this.bannerItemEls.item(this._max - 1).cloneNode(true)
        firstCloneItemEl.classList.add('clone');
        lastCloneItemEl.classList.add('clone');
        this.bannerContainerEl.insertBefore(lastCloneItemEl, this.bannerItemEls.item(0));
        this.bannerContainerEl.appendChild(firstCloneItemEl);
        this.bannerItemEls = this.bannerContainerEl.querySelectorAll('.banner-item');
    },
    resizeBanner() {
        const { innerWidth: width, innerHeight: height } = window
        this._imageWidth = width
        this._imageHeight = Math.round(this._originalImageHeight * width / this._originalImageWidth);
        if (this._imageHeight <= height) {
            this._imageHeight = height
            this._imageWidth = Math.round(this._originalImageWidth * height / this._originalImageHeight);
        }
        const marginTop = Math.round(height / 2 - this._imageHeight / 2);
        const marginLeft = Math.round(width / 2 - this._imageWidth / 2);
        this._bannerWidth = width;
        this._bannerHeight = height;
        this._containerWidth = this._infinite ? this._bannerWidth * (this._max + 2) : this._bannerWidth * this._max;
        gsap.set(this.heroBannerEl, { width: this._bannerWidth, height: this._bannerHeight });
        gsap.set(this.bannerContainerEl, { width: this._containerWidth, height: this._bannerHeight });
        gsap.set(this.bannerItemEls, { width: this._bannerWidth, height: this._bannerHeight });
        this.bannerItemEls.forEach((el) => {
            const imageEl = el.querySelector('.image-area figure img');
            gsap.set(imageEl, { width: this._imageWidth, height: this._imageHeight, marginTop, marginLeft });
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
        if (!this._infinite && id > this._max - 1) {
            id = 0;
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.changeItem(true);
        }
    },
    changeItem(withAni = false) {
        clearInterval(this._timer);
        gsap.killTweensOf(this.bannerContainerEl);
        let x = this._infinite ? this._bannerWidth * (this._cuId + 1) * -1 : this._bannerWidth * this._cuId * -1;
        const duration = this._baseDuration + this._addDuration * Math.abs(this._cuId - this._exId);
        let cloneItemEl = null
        if (this._infinite) {
            if (this._cuId < 0) {
                cloneItemEl = this.bannerItemEls.item(0);
                this._cuId = this._max - 1;
            } else if (this._cuId > this._max - 1) {
                cloneItemEl = this.bannerItemEls.item(this._max + 1);
                this._cuId = 0
            }
        }
        this.checkDotNav();
        if (!withAni) {
            gsap.set(this.bannerContainerEl, { x });
            this.checkPaddleNav();
            this._exId = this._cuId;
            this._isAni = false;
            this.autoPlayBanner();
            return
        }
        this._isAni = true;
        const itemEl = this._infinite ? this.bannerItemEls.item(this._cuId + 1) : this.bannerItemEls.item(this._cuId);
        this.itemContentInit(itemEl, cloneItemEl);
        gsap.to(this.bannerContainerEl, {
            x, duration, ease: 'power2.inOut', onComplete: () => {
                if (this._infinite) {
                    x = this._bannerWidth * (this._cuId + 1) * -1
                    gsap.set(this.bannerContainerEl,  { x })
                }
                this.checkPaddleNav();
                this.itemContentAppear(itemEl, cloneItemEl, () => {
                    this._exId = this._cuId;
                    this._isAni = false;
                    this.autoPlayBanner();
                });
            }
        });
    },
    itemContentInit(el, cloneEl = null) {
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
        if (cloneEl !== null) {
            const cloneEyebrowEl = cloneEl.querySelector('.eyebrow');
            const cloneHeadlineEl = cloneEl.querySelector('.headline');
            const cloneCopyEl = cloneEl.querySelector('.copy');
            gsap.set(cloneEyebrowEl, { autoAlpha: 0 });
            gsap.set(cloneHeadlineEl, { autoAlpha: 0 });
            gsap.set(cloneCopyEl, { autoAlpha: 0 });
        }
    },
    itemContentAppear(el, cloneEl = null, callback) {
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
                // stagger: {
                //     each: 0.1,
                //     onComplete: function() {
                //         const spanEl = this.targets()[0];
                //         spanEl.classList.add('active');
                //     }
                // },
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
    },
    checkPaddleNav() {
        if (this._infinite) {
            this.btnPaddlePreviousEl.disabled = false;
            this.btnPaddleNextEl.disabled = false;
            return
        }
        if (this._cuId === 0) {
            if (!this.btnPaddlePreviousEl.disabled) {
                this.btnPaddlePreviousEl.disabled = true;
            }
            this.btnPaddleNextEl.disabled = false;
            return
        }
        if (this._cuId === this._max - 1) {
            this.btnPaddlePreviousEl.disabled = false;
            if (!this.btnPaddleNextEl.disabled) {
                this.btnPaddleNextEl.disabled = true;
            }
            return
        }
        this.btnPaddlePreviousEl.disabled = false;
        this.btnPaddleNextEl.disabled = false;
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
    handleClickBtnPaddleEl(e) {
        e.preventDefault();
        if (this._isAni) {
            return
        }
        const { currentTarget: el } = e;
        let id = this._exId;
        if (el.classList.contains('paddle-previous')) {
            id -= 1;
        }
        if (el.classList.contains('paddle-next')) {
            id += 1;
        }
        if (this._infinite) {
            if (id < -1) {
                id = this._max - 1;
            } else if (id > this._max) {
                id = 0;
            }
        } else {
            if (id < 0) {
                id = 0;
            } else if (id > this._max - 1) {
                id = this._max - 1;
            }
        }
        if (this._exId !== id) {
            this._cuId = id;
            this.checkPaddleNav();
            this.changeItem(true);
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
