import Frame00 from '/src/img/airpods-max_frame-0000.jpg';
import Frame01 from '/src/img/airpods-max_frame-0001.jpg';
import Frame02 from '/src/img/airpods-max_frame-0002.jpg';
import Frame03 from '/src/img/airpods-max_frame-0003.jpg';
import Frame04 from '/src/img/airpods-max_frame-0004.jpg';
import Frame05 from '/src/img/airpods-max_frame-0005.jpg';
import Frame06 from '/src/img/airpods-max_frame-0006.jpg';
import Frame07 from '/src/img/airpods-max_frame-0007.jpg';
import Frame08 from '/src/img/airpods-max_frame-0008.jpg';
import Frame09 from '/src/img/airpods-max_frame-0009.jpg';
import Frame10 from '/src/img/airpods-max_frame-0010.jpg';
import Frame11 from '/src/img/airpods-max_frame-0011.jpg';
import Frame12 from '/src/img/airpods-max_frame-0012.jpg';
import Frame13 from '/src/img/airpods-max_frame-0013.jpg';
import Frame14 from '/src/img/airpods-max_frame-0014.jpg';
import Frame15 from '/src/img/airpods-max_frame-0015.jpg';
import Frame16 from '/src/img/airpods-max_frame-0016.jpg';
import Frame17 from '/src/img/airpods-max_frame-0017.jpg';
import Frame18 from '/src/img/airpods-max_frame-0018.jpg';
import Frame19 from '/src/img/airpods-max_frame-0019.jpg';
import Frame20 from '/src/img/airpods-max_frame-0020.jpg';
import Frame21 from '/src/img/airpods-max_frame-0021.jpg';
import Frame22 from '/src/img/airpods-max_frame-0022.jpg';
import Frame23 from '/src/img/airpods-max_frame-0023.jpg';
import Frame24 from '/src/img/airpods-max_frame-0024.jpg';
import Frame25 from '/src/img/airpods-max_frame-0025.jpg';
import Frame26 from '/src/img/airpods-max_frame-0026.jpg';
import Frame27 from '/src/img/airpods-max_frame-0027.jpg';
import Frame28 from '/src/img/airpods-max_frame-0028.jpg';
import Frame29 from '/src/img/airpods-max_frame-0029.jpg';
import Frame30 from '/src/img/airpods-max_frame-0030.jpg';
import Frame31 from '/src/img/airpods-max_frame-0031.jpg';
import Frame32 from '/src/img/airpods-max_frame-0032.jpg';
import Frame33 from '/src/img/airpods-max_frame-0033.jpg';
import Frame34 from '/src/img/airpods-max_frame-0034.jpg';
import Frame35 from '/src/img/airpods-max_frame-0035.jpg';
import Frame36 from '/src/img/airpods-max_frame-0036.jpg';
import Frame37 from '/src/img/airpods-max_frame-0037.jpg';
import Frame38 from '/src/img/airpods-max_frame-0038.jpg';
import Frame39 from '/src/img/airpods-max_frame-0039.jpg';
import Frame40 from '/src/img/airpods-max_frame-0040.jpg';
import Frame41 from '/src/img/airpods-max_frame-0041.jpg';
import Frame42 from '/src/img/airpods-max_frame-0042.jpg';
import Frame43 from '/src/img/airpods-max_frame-0043.jpg';
import Frame44 from '/src/img/airpods-max_frame-0044.jpg';

// lerp (Linear Interpolation) - 선형 보간법
Math.lerp = function(start, end, ratio) {
    return start + (end - start) * ratio;
}

const FRAMES = [ Frame00, Frame01, Frame02, Frame03, Frame04, Frame05, Frame06, Frame07, Frame08, Frame09, Frame10, Frame11, Frame12, Frame13, Frame14, Frame15, Frame16, Frame17, Frame18, Frame19, Frame20, Frame21, Frame22, Frame23, Frame24, Frame25, Frame26, Frame27, Frame28, Frame29, Frame30, Frame31, Frame32, Frame33, Frame34, Frame35, Frame36, Frame37, Frame38, Frame39, Frame40, Frame41, Frame42, Frame43, Frame44 ];

const APP = {
    // _basePath: '/src/img',
    // _imageName: 'airpods-max_frame-',
    // _extension: 'jpg',
    _frames: [],
    _width: 1004,
    _height: 1214,
    _rotateDistance: 700,
    _teleDistance: 300,
    _teleAmount: 100,
    _cuId: 0,
    _max: null,
    // _max: 45,
    _isLoaded: false,
    _isEnabled: false,

    init() {
        this.layout();
        this.drawCanvas();
        this.preloadFrame();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.mainEl = document.querySelector('#main');
        this.heroEl = this.mainEl.querySelector('#hero');
        this.stickyWrapEl = this.heroEl.querySelector('.sticky-wrap');
        this.stickyInnerEl = this.stickyWrapEl.querySelector('.sticky-inner');
        this.productEl = this.heroEl.querySelector('#product');
        this.productVisualEl = this.productEl.querySelector('#product-visual');
        this.canvasEl = this.productVisualEl.querySelector('#frame-sequence');
        this.cupsEl = this.productVisualEl.querySelector('#cups');
        this.frameEl = this.productVisualEl.querySelector('#frame');
    },
    addEvent() {
        window.addEventListener('resize', this.handleResizeWindow.bind(this));
        window.addEventListener('scroll', this.handleScrollWindow.bind(this), { passive: true });
    },
    reset() {
        this._rotateProgressRatio = this._rotateDistance / (this._rotateDistance + this._teleDistance);
        this._canvasRatio = this._width / this._height;
        this._startScale = 1 / 1.5;
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
    },
    drawCanvas() {
        this.canvasEl.setAttribute("width", this._width);
        this.canvasEl.setAttribute("height", this._height);
        this.context = this.canvasEl.getContext("2d");
    },
    preloadFrame() {
        let loadedCheckCount = 0;
        this._max = FRAMES.length;
        for (let i = 0; i < this._max; i++) {
            // let order = `0000${i}`;
            // order = order.substring(order.length - 4);
            // const imageUrl = this._basePath + '/' + this._imageName + order + '.' + this._extension;
            const imageUrl = FRAMES[i];
            const img = new Image();
            img.onload = () => {
                loadedCheckCount++;
                if (loadedCheckCount >= this._max) {
                    this._isLoaded = true;
                    this.mainEl.classList.remove('inactive');
                    this.drawFrame();
                    window.dispatchEvent(new Event('scroll'));
                }
            };
            this._frames.push(img);
            img.src = imageUrl;
        }
    },
    drawFrame(ratio = 0) {
        if (!this._isLoaded) {
            return
        }
        this.context.clearRect(0, 0, this._width, this._height);
        const id = Math.round(Math.lerp(0, this._max - 1, ratio));
        this.context.drawImage(this._frames[id], 0, 0, this._width, this._height);
    },
    visualScroll() {
        if (!this._isLoaded) {
            return
        }
        const { y, height } = this.stickyWrapEl.getBoundingClientRect();
        const limit = height - this._windowHeight;
        if (y <= 0 && limit + y >= 0) {
            const current = Math.min(1, (y * -1) / this._rotateDistance);
            const scaleRatio = (y * -1) / limit;
            const visualScale = this._startScale + Math.lerp(0, 1 - this._startScale, scaleRatio);
            gsap.set(this.productVisualEl, { scale: visualScale });
            if (current > this._rotateProgressRatio) {
                this.cupsEl.classList.add('visible');
                this.frameEl.classList.add('visible');
            } else {
                this.cupsEl.classList.remove('visible');
                this.frameEl.classList.remove('visible');
                gsap.set(this.frameEl, { y: 0 });
            }
            if (current <= this._rotateProgressRatio) {
                const ratio = Math.lerp(0, 1, current / this._rotateProgressRatio);
                return this.drawFrame(ratio);
            }
            const frameY = Math.lerp(0, 1, (current - this._rotateProgressRatio) / (1 - this._rotateProgressRatio)) * this._teleAmount * -1;
            gsap.set(this.frameEl, { y: frameY });
            this.context.clearRect(0, 0, this._width, this._height);
            return;
        }
        if (y > 0) {
            gsap.set(this.productVisualEl, { scale: this._startScale });
            return;
        }
        gsap.set(this.productVisualEl, { scale: 1.0 });
    },
    handleResizeWindow() {
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window
        this._windowHeight = windowHeight;
        this._visualRatio = this.productVisualEl.offsetWidth / this.productVisualEl.offsetHeight;
        this._stickyInnerHeight = this._visualRatio > this._canvasRatio ? 1.5 * windowHeight : windowWidth * this._canvasRatio * 1.5
        this.stickyInnerEl.style.height = `${this._stickyInnerHeight}px`;
        this.stickyWrapEl.style.height = `${this._stickyInnerHeight + this._teleDistance + this._rotateDistance}px`;
    },
    handleScrollWindow() {
        if (this._isEnabled) {
            return;
        }
        this._isEnabled = true;
        window.requestAnimationFrame(() => {
            this.visualScroll();
            this._isEnabled = false;
        });
    }
}

APP.init();
