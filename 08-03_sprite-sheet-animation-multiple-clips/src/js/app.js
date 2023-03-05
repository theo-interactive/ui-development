import Sequence1Image from '/src/img/sequence1.png';
import Sequence2Image from '/src/img/sequence2.png';
import MinionImage from '/src/img/minion.png';
import ZootopiaImage from '/src/img/zootopia.png';

function Sprite(target, options) {
    const targetEl = document.querySelector(target);
    const defaults = {
        fps: 24
    };
    const settings = {
        ...defaults,
        ...options
    };
    let clipEl = null;
    const { id, imageUrl, imageWidth, imageHeight, col, row, max, fps } = settings
    const clipWidth = imageWidth / col;
    const clipHeight = imageHeight / row;
    let cuId = 0;
    let isReverse = false;
    let timer = null;

    function init() {
        create();
        addEvent();
        reset();
    }

    function create() {
        if (!targetEl) {
            return;
        }
        clipEl = document.createElement('div');
        if (id && id !== '') {
            clipEl.id = id;
        }
        clipEl.classList.add('clip');
        clipEl.style.width = `${clipWidth}px`;
        clipEl.style.height = `${clipHeight}px`;
        clipEl.style.backgroundImage = `url(${imageUrl})`;
        clipEl.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
        targetEl.append(clipEl);
    }

    function addEvent() {
        clipEl.addEventListener('mouseenter', handleMouseEnterClipEl);
        clipEl.addEventListener('mouseleave', handleMouseLeaveClipEl);
    }

    function reset() {
        updateFrame();
    }

    function playFrame() {
        clearInterval(timer);
        timer = setInterval(progressFrame, 1000 / fps);
    }

    function stopFrame() {
        clearInterval(timer);
    }

    function progressFrame() {
        if (!isReverse) {
            cuId++;
        } else {
            cuId--;
        }
        if (cuId <= 0) {
            cuId = 0;
            if (isReverse) {
                stopFrame();
            }
        }
        if (cuId >= max - 1) {
            cuId = max - 1;
            if (!isReverse) {
                stopFrame();
            }
        }
        updateFrame();
    }

    function updateFrame() {
        const posX = cuId % col * clipWidth * -1;
        const posY = Math.floor(cuId / col) * clipHeight * -1;
        clipEl.style.backgroundPosition = `${posX}px ${posY}px`;
    }

    function handleMouseEnterClipEl(e) {
        if (cuId > max - 1) {
            return
        }
        stopFrame();
        isReverse = false;
        playFrame();
    }

    function handleMouseLeaveClipEl(e) {
        if (this._cuId < 0) {
            return
        }
        stopFrame();
        isReverse = true;
        playFrame();
    }

    init();

    return {
        playFrame: playFrame,
        stopFrame: stopFrame
    }
}

const APP = {
    init() {
        this.createClip();
        this.reset();
    },
    createClip() {
        this._clip1 = new Sprite('#wrap', {
            id: 'clip-1',
            imageUrl: Sequence1Image,
            imageWidth: 904,
            imageHeight: 468,
            col: 8,
            row: 4,
            max: 34
        });
        this._clip2 = new Sprite('#wrap', {
            id: 'clip-2',
            imageUrl: Sequence2Image,
            imageWidth: 904,
            imageHeight: 468,
            col: 8,
            row: 4,
            max: 34
        });
        this._clip3 = new Sprite('#wrap', {
            id: 'minion',
            imageUrl: MinionImage,
            imageWidth: 1008,
            imageHeight: 1008,
            col: 7,
            row: 7,
            max: 48,
            fps: 15
        });
        this._clip4 = new Sprite('#wrap', {
            id: 'zootopia',
            imageUrl: ZootopiaImage,
            imageWidth: 576,
            imageHeight: 432,
            col: 4,
            row: 3,
            max: 12,
            fps: 15
        });
    },
    reset() {
        this._clip1.stopFrame();
        this._clip2.stopFrame();
        this._clip3.stopFrame();
        this._clip4.stopFrame();
    }
}

APP.init();
