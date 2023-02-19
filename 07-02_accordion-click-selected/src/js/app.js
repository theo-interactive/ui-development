const APP = {
    _cuId: null,
    _exId: null,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.accordionEl = document.querySelector('#accordion');
        this.accordionViewEl = this.accordionEl.querySelectorAll('.accordion-item');
        this.accordionCollapseEls = this.accordionEl.querySelectorAll('.accordion-collapse');
        this.btnCloseEls = this.accordionEl.querySelectorAll('.btn-close');
    },
    addEvent() {
        this.accordionCollapseEls.forEach((el) => {
            el.addEventListener('click', this.handleClickAccordionCollapseEl.bind(this));
        });
        this.btnCloseEls.forEach((el) => {
            el.addEventListener('click', this.handleClickBtnCloseEl.bind(this));
        });
    },
    reset() {
        this._cuId = 0;
        this._exId = this._cuId;
    },
    handleClickAccordionCollapseEl(e) {
        e.preventDefault();
        const el = e.currentTarget;
        const viewEl = el.closest('.accordion-item');
        if (viewEl.classList.contains('selected')) {
            return
        }
        this._cuId = [...this.accordionCollapseEls].indexOf(el);
        if (this._exId !== null) {
            this.accordionViewEl[this._exId].classList.remove('selected');
            // this.accordionViewEl.item(this._exId).classList.remove('selected');
        }
        viewEl.classList.add('selected');
        this._exId = this._cuId;
    },
    handleClickBtnCloseEl(e) {
        e.preventDefault();
        const el = e.currentTarget;
        const viewEl = el.closest('.accordion-item');
        if (!viewEl.classList.contains('selected')) {
            return
        }
        if (this._exId !== null) {
            this.accordionViewEl[this._exId].classList.remove('selected');
            // this.accordionViewEl.item(this._exId).classList.remove('selected');
        }
        this._cuId = null;
        this._exId = this._cuId;
    }
}

APP.init();
