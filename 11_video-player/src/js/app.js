const PLAYLIST = [
    [{'type': 'video/mp4', 'src': '/video/video.mp4'}]
];

const APP = {
    _isHour: true,
    _isPlay: false,
    _isMute: false,
    _isTimeDrag: false,
    _isVolumeDrag: false,
    _isEnd: false,
    _isFS: false,
    _duration: 0,
    _cuId: 0,
    _cuTime: 0,
    _cuVolume: null,

    init() {
        this.layout();
        this.setVideo();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.videoPlayerEl = document.getElementById('video-player');
        this.videoEl = this.videoPlayerEl.querySelector('video.video');
        this.videoControlsEl = this.videoPlayerEl.querySelector('.video-controls');
        this.progressBarContainerEl = this.videoControlsEl.querySelector('.progress-bar-container');
        this.progressBarEl = this.progressBarContainerEl.querySelector('.progress-bar');
        this.progressEl = this.progressBarEl.querySelector('.progress');
        this.progressHandleEl = this.progressBarEl.querySelector('.handle');
        this.currentTimeEl = this.progressBarContainerEl.querySelector('.current-time');
        this.totalTimeEl = this.progressBarContainerEl.querySelector('.total-time');
        this.controlContainerEl = this.videoControlsEl.querySelector('.controls-container');
        this.playControlEl = this.controlContainerEl.querySelector('.play-control');
        this.btnPrevEl = this.playControlEl.querySelector('.btn-prev');
        this.btnPlayPauseEl = this.playControlEl.querySelector('.btn-play-pause');
        this.btnNextEl = this.playControlEl.querySelector('.btn-next');
        this.volumeControlEl = this.controlContainerEl.querySelector('.volume-control');
        this.btnMuteEl = this.volumeControlEl.querySelector('.btn-mute');
        this.volumeBarEl = this.volumeControlEl.querySelector('.volume-bar');
        this.volumeEl = this.volumeBarEl.querySelector('.volume');
        this.volumeHandleEl = this.volumeBarEl.querySelector('.handle');
        this.fullscreenControlEl = this.controlContainerEl.querySelector('.fullscreen-control');
        this.btnFullscreenEl = this.fullscreenControlEl.querySelector('.btn-fullscreen');
    },
    addEvent() {
        this.videoEl.addEventListener('loadedmetadata', this.handleLoadMetaDataVideo.bind(this));
        this.videoEl.addEventListener('timeupdate', this.handleTimeUpdateVideo.bind(this));
        this.videoEl.addEventListener('ended', this.handleEndedVideo.bind(this));
        this.progressBarEl.addEventListener('mousedown', this.handleMouseDownProgress.bind(this));
        window.addEventListener('mousemove', this.handleMouseMoveProgress.bind(this));
        window.addEventListener('mouseup', this.handleMouseUpProgress.bind(this));
        this.btnPlayPauseEl.addEventListener('click', this.handleClickPlayPauseEl.bind(this));
        this.btnMuteEl.addEventListener('click', this.handleClickMuteEl.bind(this));
        this.volumeBarEl.addEventListener('mousedown', this.handleMouseDownVolume.bind(this));
        window.addEventListener('mousemove', this.handleMouseMoveVolume.bind(this));
        window.addEventListener('mouseup', this.handleMouseUpVolume.bind(this));
        this.btnFullscreenEl.addEventListener('click', this.handleClickFullscreenEl.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleChangeWebkitFullscreen.bind(this), false);
        document.addEventListener('mozfullscreenchange', this.handleChangeMozFullscreen.bind(this), false);
        document.addEventListener('fullscreenchange', this.handleChangeFullscreen.bind(this), false);
    },
    reset() {
        this.selectClip();
    },
    setVideo() {
        if (PLAYLIST.length <= 1) {
            this.btnPrevEl.style.display = 'none';
            this.btnNextEl.style.display = 'none';
        }
        this.videoEl.loop = false;
    },
    selectClip() {
        const playItems = PLAYLIST[this._cuId];
        this.videoEl.innerHTML = '';
        this._cuTime = 0;
        playItems.forEach((item) => {
            const sourceEl = document.createElement('source');
            const {type, src} = item;
            sourceEl.type = type;
            sourceEl.src = src;
            sourceEl.src = src;
            this.videoEl.appendChild(sourceEl);
        });
        this.videoEl.currentTime = this._cuTime;
        this.updateProgressBar(this._cuTime);
        if (this._isPlay) {
            this.videoEl.play();
        }
    },
    getTimeFormat(ms) {
        let hours = Math.floor(ms / 3600);
        let minutes = Math.floor((ms - (hours * 3600)) / 60);
        let seconds = Math.floor(ms - (hours * 3600) - (minutes * 60));
        let result = '';
        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (this._isHour) {
            result += `${hours}:`;
        }
        result += `${minutes}:${seconds}`;
        return result;
    },
    updateProgressBar(time) {
        const percent = time / this._duration * 100;
        this.progressEl.style.width = `${percent}%`;
        this.progressHandleEl.style.left = `${percent}%`;
    },
    updateProgress(x) {
        const {left, width} = this.progressBarEl.getBoundingClientRect()
        let pos = x - left;
        if (pos >= width) {
            pos = width;
        }
        if (pos <= 0) {
            pos = 0;
        }
        this._cuTime = pos / width * this._duration;
        this.updateProgressBar(this._cuTime);
        this.videoEl.currentTime = this._cuTime;
    },
    updateVolumeBar(volume) {
        const percent = volume * 100;
        this.volumeEl.style.width = `${percent}%`
        this.volumeHandleEl.style.left = `${percent}%`
    },
    updateVolume(x) {
        const {left, width} = this.volumeBarEl.getBoundingClientRect();
        let pos = x - left;
        if (pos >= width) {
            pos = width;
        }
        if (pos <= 0) {
            pos = 0;
        }
        this._cuVolume = pos / width;
        if (this._cuVolume <= 0) {
            this.btnMuteEl.classList.add('muted');
        } else {
            this.btnMuteEl.classList.remove('muted');
        }
        this._isMute = this._cuVolume <= 0;
        this.updateVolumeBar(this._cuVolume);
        this.videoEl.volume = this._cuVolume;
    },
    setFullscreen(fs = false) {
        if (!fs) {
            this.videoPlayerEl.classList.add('fs');
        } else {
            this.videoPlayerEl.classList.remove('fs');
        }
        this.updateProgressBar(this._cuTime);
        if (!this._isMute) this.updateVolumeBar(this._cuVolume);
    },
    handleLoadMetaDataVideo() {
        this._duration = this.videoEl.duration;
        this._isHour = this._duration >= 3600
        this.totalTimeEl.innerHTML = this.getTimeFormat(this._duration);
        this.currentTimeEl.innerHTML = this.getTimeFormat(this._cuTime);
        this._cuVolume = this.videoEl.volume;
    },
    handleTimeUpdateVideo() {
        this._cuTime = this.videoEl.currentTime;
        this.currentTimeEl.innerHTML = this.getTimeFormat(this._cuTime);
        if (!this._isTimeDrag) {
            this.updateProgressBar(this._cuTime);
        }
        if (PLAYLIST.length <= 1) {
            if (this._cuTime >= this._duration) {
                this.btnPlayPauseEl.classList.remove('paused');
                this._isPlay = false;
            }
        }
    },
    handleEndedVideo() {
        this._cuId++;
        if (this._cuId > PLAYLIST.length - 1) {
            this._cuId = 0;
        }
        this.selectClip();
    },
    handleMouseDownProgress(e) {
        e.preventDefault();
        if (this._isTimeDrag) {
            return
        }
        this._isTimeDrag = true;
        this.videoEl.pause();
        this.updateProgress(e.pageX);
    },
    handleMouseMoveProgress(e) {
        e.preventDefault();
        if (!this._isTimeDrag) {
            return
        }
        this.updateProgress(e.pageX);
    },
    handleMouseUpProgress(e) {
        e.preventDefault();
        if (!this._isTimeDrag) {
            return
        }
        this._isTimeDrag = false;
        this.updateProgress(e.pageX);
        if (this._isPlay) {
            this.videoEl.play();
        }
    },
    handleClickPlayPauseEl() {
        if (!this._isPlay) {
            this.btnPlayPauseEl.classList.add('paused');
            this.videoEl.play();
        } else {
            this.btnPlayPauseEl.classList.remove('paused');
            this.videoEl.pause();
        }
        this._isPlay = !this._isPlay;
    },
    handleClickMuteEl() {
        if (!this._isMute) {
            this.btnMuteEl.classList.add('muted');
            this.videoEl.volume = 0;
            this.updateVolumeBar(0);
        } else {
            this.btnMuteEl.classList.remove('muted');
            if (this._cuVolume <= 0) {
                this._cuVolume = 0.1;
            }
            this.videoEl.volume = this._cuVolume;
            this.updateVolumeBar(this._cuVolume);
        }
        this._isMute = !this._isMute;
    },
    handleMouseDownVolume(e) {
        e.preventDefault();
        if (this._isVolumeDrag) {
            return
        }
        this._isVolumeDrag = true;
        this.updateVolume(e.pageX);
    },
    handleMouseMoveVolume(e) {
        e.preventDefault();
        if (!this._isVolumeDrag) {
            return
        }
        this.updateVolume(e.pageX);
    },
    handleMouseUpVolume(e) {
        e.preventDefault();
        if (!this._isVolumeDrag) {
            return
        }
        this._isVolumeDrag = false;
        this.updateVolume(e.pageX);
    },
    handleClickFullscreenEl() {
        if (!this._isFS) {
            if (this.videoPlayerEl.requestFullscreen) {
                this.videoPlayerEl.requestFullscreen();
            } else if (this.videoPlayerEl.mozRequestFullScreen) {
                this.videoPlayerEl.mozRequestFullScreen();
            } else if (this.videoPlayerEl.webkitRequestFullscreen) {
                this.videoPlayerEl.webkitRequestFullscreen();
            } else if (this.videoPlayerEl.msRequestFullscreen) {
                this.videoPlayerEl.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {}).catch((err) => console.error(err));
            } else if (this.videoPlayerEl.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    },
    handleChangeFullscreen() {
        this._isFS = document.fullscreenElement != null;
        this.setFullscreen(document.fullscreenElement === null);
    },
    handleChangeWebkitFullscreen() {
        this._isFS = document.webkitIsFullScreen;
        this.setFullscreen(!document.webkitIsFullScreen);
    },
    handleChangeMozFullscreen() {
        console.log('handleChangeMozFullscreen');
        this._isFS = document.mozIsFullScreen;
        this.setFullscreen(!document.mozIsFullScreen);
    }
}
APP.init();

