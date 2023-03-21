const PLAYLIST = [{
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Intro',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Intro.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'VCR',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/VCR.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Crystalised',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Crystalised.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Islands',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Islands.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Heart Skipped A Beat',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Heart Skipped A Beat.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Fantasy',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Fantasy.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Shelter',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Shelter.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Basic Space',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Basic Space.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Infinity',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Infinity.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Night Time',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Night Time.mp3'
}, {
    'album': 'xx',
    'byline': 'The xx',
    'title': 'Stars',
    'year': 2009,
    'artwork': '/poster/artwork.jpg',
    'track': '/audio/Stars.mp3'
}];

const APP = {
    _audio: null,
    _isHour: true,
    _isPlay: false,
    _isMute: false,
    _isTimeDrag: false,
    _isVolumeDrag: false,
    _isEnd: false,
    _duration: 0,
    _cuId: 0,
    _cuTime: 0,
    _cuVolume: null,

    init() {
        this.layout();
        this.createAudio();
        this.addEvent();
        this.reset();
    },
    layout() {
        this.audioPlayerEl = document.getElementById('audio-player');
        this.audioInfoEl = this.audioPlayerEl.querySelector('.audio-info');
        this.songCoverEl = this.audioInfoEl.querySelector('.song-cover');
        this.artworkEl = this.songCoverEl.querySelector('img');
        this.songInfoEl = this.audioInfoEl.querySelector('.song-info');
        this.songInfoTitleEl = this.songInfoEl.querySelector('.song-title');
        this.songInfoDescEl = this.songInfoEl.querySelector('.song-desc');
        this.titleEl = this.songInfoTitleEl.querySelector('.title');
        this.bylineEl = this.songInfoDescEl.querySelector('.byline');
        this.albumEl = this.songInfoDescEl.querySelector('.album');
        this.yearEl = this.songInfoDescEl.querySelector('.year');
        this.audioControlsEl = this.audioPlayerEl.querySelector('.audio-controls');
        this.progressBarContainerEl = this.audioControlsEl.querySelector('.progress-bar-container');
        this.progressBarEl = this.progressBarContainerEl.querySelector('.progress-bar');
        this.progressEl = this.progressBarEl.querySelector('.progress');
        this.progressHandleEl = this.progressBarEl.querySelector('.handle');
        this.controlContainerEl = this.audioControlsEl.querySelector('.controls-container');
        this.playControlEl = this.controlContainerEl.querySelector('.play-control');
        this.btnPrevEl = this.playControlEl.querySelector('.btn-prev');
        this.btnPlayPauseEl = this.playControlEl.querySelector('.btn-play-pause');
        this.btnNextEl = this.playControlEl.querySelector('.btn-next');
        this.timeInfoEl = this.controlContainerEl.querySelector('.time-info');
        this.currentTimeEl = this.timeInfoEl.querySelector('.current-time');
        this.totalTimeEl = this.timeInfoEl.querySelector('.total-time');
        this.volumeControlEl = this.controlContainerEl.querySelector('.volume-control');
        this.btnMuteEl = this.volumeControlEl.querySelector('.btn-mute');
        this.volumeBarEl = this.volumeControlEl.querySelector('.volume-bar');
        this.volumeEl = this.volumeBarEl.querySelector('.volume');
        this.volumeHandleEl = this.volumeBarEl.querySelector('.handle');
    },
    addEvent() {
        this._audio.addEventListener('loadedmetadata', this.handleLoadMetaDataAudio.bind(this));
        this._audio.addEventListener('timeupdate', this.handleTimeUpdateAudio.bind(this));
        this._audio.addEventListener('ended', this.handleEndedAudio.bind(this));
        this.progressBarEl.addEventListener('mousedown', this.handleMouseDownProgress.bind(this));
        window.addEventListener('mousemove', this.handleMouseMoveProgress.bind(this));
        window.addEventListener('mouseup', this.handleMouseUpProgress.bind(this));
        this.btnPrevEl.addEventListener('click', this.handleClickPrevEl.bind(this));
        this.btnPlayPauseEl.addEventListener('click', this.handleClickPlayPauseEl.bind(this));
        this.btnNextEl.addEventListener('click', this.handleClickNextEl.bind(this));
        this.btnMuteEl.addEventListener('click', this.handleClickMuteEl.bind(this));
        this.volumeBarEl.addEventListener('mousedown', this.handleMouseDownVolume.bind(this));
        window.addEventListener('mousemove', this.handleMouseMoveVolume.bind(this));
        window.addEventListener('mouseup', this.handleMouseUpVolume.bind(this));
    },
    reset() {
        this.selectTrack()
    },
    createAudio() {
        if (PLAYLIST.length <= 1) {
            this.btnPrevEl.style.display = 'none';
            this.btnNextEl.style.display = 'none';
        }
        this._audio = new Audio();
        this._audio.loop = false;
    },
    selectTrack() {
        const playItem = PLAYLIST[this._cuId];
        const {album, byline, title, year, artwork, track} = playItem
        this.titleEl.innerHTML = title;
        this.bylineEl.innerHTML = byline;
        this.albumEl.innerHTML = album;
        this.yearEl.innerHTML = `${year}`;
        this._cuTime = 0;
        this.artworkEl.src = artwork
        // this.artworkEl.setAttribute('src', artwork);
        this._audio.src = track;
        this._audio.currentTime = this._cuTime;
        this.updateProgressBar(this._cuTime);
        if (this._isPlay) {
            this._audio.play();
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
        this.progressEl.style.width = percent + "%";
        this.progressHandleEl.style.left = percent + "%";
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
        this._audio.currentTime = this._cuTime;
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
            this.btnMuteEl.classList.add("muted");
        } else {
            this.btnMuteEl.classList.remove("muted");
        }
        this._isMute = this._cuVolume <= 0;
        this.updateVolumeBar(this._cuVolume);
        this._audio.volume = this._cuVolume;
    },
    handleLoadMetaDataAudio() {
        this._duration = this._audio.duration;
        this._isHour = this._duration >= 3600
        this.totalTimeEl.innerHTML = this.getTimeFormat(this._duration);
        this.currentTimeEl.innerHTML = this.getTimeFormat(this._cuTime);
        this._cuVolume = this._audio.volume;
    },
    handleTimeUpdateAudio() {
        this._cuTime = this._audio.currentTime;
        this.currentTimeEl.innerHTML = this.getTimeFormat(this._cuTime);
        if (!this._isTimeDrag) {
            this.updateProgressBar(this._cuTime);
        }
        if (PLAYLIST.length <= 1) {
            if (this._cuTime >= this._duration) {
                this.btnPlayPauseEl.classList.remove("paused");
                this._isPlay = false;
            }
        }
    },
    handleEndedAudio() {
        this._cuId++;
        if (this._cuId > PLAYLIST.length - 1) {
            this._cuId = 0;
        }
        this.selectTrack();
    },
    handleMouseDownProgress(e) {
        e.preventDefault();
        if (this._isTimeDrag) {
            return;
        }
        this._isTimeDrag = true;
        this._audio.pause();
        this.updateProgress(e.pageX);
    },
    handleMouseMoveProgress(e) {
        e.preventDefault();
        if (!this._isTimeDrag) {
            return;
        }
        this.updateProgress(e.pageX);
    },
    handleMouseUpProgress(e) {
        e.preventDefault();
        if (!this._isTimeDrag) {
            return;
        }
        this._isTimeDrag = false;
        this.updateProgress(e.pageX);
        if (this._isPlay) {
            this._audio.play();
        }
    },
    handleClickPrevEl() {
        this._cuId--;
        if (this._cuId < 0) {
            this._cuId = PLAYLIST.length - 1;
        }
        this.selectTrack();
    },
    handleClickPlayPauseEl() {
        if (!this._isPlay) {
            this.btnPlayPauseEl.classList.add("paused");
            this._audio.play();
        } else {
            this.btnPlayPauseEl.classList.remove("paused");
            this._audio.pause();
        }
        this._isPlay = !this._isPlay;
    },
    handleClickNextEl() {
        this._cuId++;
        if (this._cuId > PLAYLIST.length - 1) {
            this._cuId = 0;
        }
        this.selectTrack();
    },
    handleClickMuteEl() {
        if (!this._isMute) {
            this.btnMuteEl.classList.add("muted");
            this._audio.volume = 0;
            this.updateVolumeBar(0);
        } else {
            this.btnMuteEl.classList.remove("muted");
            if (this._cuVolume <= 0) {
                this._cuVolume = 0.1;
            }
            this._audio.volume = this._cuVolume;
            this.updateVolumeBar(this._cuVolume);
        }
        this._isMute = !this._isMute;
    },
    handleMouseDownVolume(e) {
        e.preventDefault();
        if (this._isVolumeDrag) {
            return;
        }
        this._isVolumeDrag = true;
        this.updateVolume(e.pageX);
    },
    handleMouseMoveVolume(e) {
        e.preventDefault();
        if (!this._isVolumeDrag) {
            return;
        }
        this.updateVolume(e.pageX);
    },
    handleMouseUpVolume(e) {
        e.preventDefault();
        if (!this._isVolumeDrag) {
            return;
        }
        this._isVolumeDrag = false;
        this.updateVolume(e.pageX);
    }
}
APP.init();
