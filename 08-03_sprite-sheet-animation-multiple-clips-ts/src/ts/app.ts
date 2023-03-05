import Sprite from "./sprite";

// @ts-ignore
import Sequence1Image from '/src/img/sequence1.png';
// @ts-ignore
import Sequence2Image from '/src/img/sequence2.png';
// @ts-ignore
import MinionImage from '/src/img/minion.png';
// @ts-ignore
import ZootopiaImage from '/src/img/zootopia.png';

class App {

  clip1: Sprite | undefined
  clip2: Sprite | undefined
  clip3: Sprite | undefined
  clip4: Sprite | undefined

  constructor() {
    this.createClip();
    this.reset();
  }

  createClip() {
    this.clip1 = new Sprite('#wrap', {
      id: 'clip-1',
      imageUrl: Sequence1Image,
      imageWidth: 904,
      imageHeight: 468,
      col: 8,
      row: 4,
      max: 34
    });
    this.clip2 = new Sprite('#wrap', {
      id: 'clip-2',
      imageUrl: Sequence2Image,
      imageWidth: 904,
      imageHeight: 468,
      col: 8,
      row: 4,
      max: 34
    });
    this.clip3 = new Sprite('#wrap', {
      id: 'minion',
      imageUrl: MinionImage,
      imageWidth: 1008,
      imageHeight: 1008,
      col: 7,
      row: 7,
      max: 48,
      fps: 15
    });
    this.clip4 = new Sprite('#wrap', {
      id: 'zootopia',
      imageUrl: ZootopiaImage,
      imageWidth: 576,
      imageHeight: 432,
      col: 4,
      row: 3,
      max: 12,
      fps: 15
    });
  }

  reset() {
    if (this.clip1) {
      this.clip1.stopFrame();
    }
    if (this.clip2) {
      this.clip2.stopFrame();
    }
    if (this.clip3) {
      this.clip3.stopFrame();
    }
    if (this.clip4) {
      this.clip4.stopFrame();
    }
  }
}

new App();
