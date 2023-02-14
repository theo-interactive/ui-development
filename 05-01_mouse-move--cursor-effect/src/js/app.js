const APP = {
    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.btnListEls = document.querySelectorAll('#image-list li a');
        this.cursorDotEl = document.querySelector('#cursor-dot');
        this.cursorBGEl = document.querySelector('#cursor-bg');
        this.selectEl = document.querySelector('#select');
    },
    addEvent() {
        window.addEventListener('mousemove', this.handleMouseMoveWindow.bind(this));
        this.btnListEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnListEl.bind(this));
            el.addEventListener('mouseenter', this.handleMouseEnterBtnListEl.bind(this));
            el.addEventListener('mouseleave', this.handleMouseLeaveBtnListEl.bind(this));
        });
    },
    reset() {
        this.resetAnchor();
    },
    resetAnchor() {
        gsap.killTweensOf(this.cursorDotEl);
        gsap.killTweensOf(this.cursorBGEl);
        gsap.killTweensOf(this.selectEl);
    },
    handleMouseMoveWindow(e) {
        const { pageY: top, pageX: left } = e;
        this.resetAnchor();
        gsap.to(this.cursorDotEl, { top, left, duration: 0.1 });
        gsap.to(this.cursorBGEl, { top, left, duration: 0.3, ease: 'sine.out' });
        gsap.to(this.selectEl, { top, left, duration: 0.25, ease: 'sine.out' });
    },
    handleClickBtnListEl(e) {
        e.preventDefault();
    },
    handleMouseEnterBtnListEl() {
        if (!this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.add('active');
        }
        if (!this.selectEl.classList.contains('active')) {
            this.selectEl.classList.add('active');
        }
    },
    handleMouseLeaveBtnListEl() {
        if (this.cursorBGEl.classList.contains('active')) {
            this.cursorBGEl.classList.remove('active');
        }
        if (this.selectEl.classList.contains('active')) {
            this.selectEl.classList.remove('active');
        }
    }
}

APP.init();
