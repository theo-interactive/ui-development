const APP = {
    _fps: 24,
    _col: 8,
    _row: 4,
    _max: 32,
    _imageWidth: 904,
    _imageHeight: 468,
    _clipWidth: null,
    _clipHeight: null,
    _cuId: 0,
    _isReverse: false,
    _timer: null,

    init() {
        this.layout();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.clipEl = document.querySelector('#clip');
    },
    addEvent() {
        this.clipEl.addEventListener('mouseenter', this.handleMouseEnterClipEl.bind(this));
        this.clipEl.addEventListener('mouseleave', this.handleMouseLeaveClipEl.bind(this));
    },
    reset() {
        this._clipWidth = this._imageWidth / this._col;
        this._clipHeight = this._imageHeight / this._row;
    },
    playFrame() {
        clearInterval(this._timer);
        this._timer = setInterval(this.progressFrame.bind(this), 1000 / this._fps);
    },
    stopFrame() {
        clearInterval(this._timer);
    },
    progressFrame() {
        if (!this._isReverse) {
            this._cuId++;
        } else {
            this._cuId--;
        }
        if (this._cuId <= 0) {
            this._cuId = 0;
            if (this._isReverse) {
                this.stopFrame();
            }
        }
        if (this._cuId >= this._max - 1) {
            this._cuId = this._max - 1;
            if (!this._isReverse) {
                this.stopFrame();
            }
        }
        this.updateFrame();
    },
    updateFrame() {
        const posX = this._cuId % this._col * this._clipWidth * -1;
        const posY = Math.floor(this._cuId / this._col) * this._clipHeight * -1;
        this.clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
    },
    handleMouseEnterClipEl() {
        if (this._cuId > this._max - 1) {
            return
        }
        this.stopFrame();
        this._isReverse = false;
        this.playFrame();
    },
    handleMouseLeaveClipEl() {
        if (this._cuId < 0) {
            return
        }
        this.stopFrame();
        this._isReverse = true;
        this.playFrame();
    }
}

APP.init();
