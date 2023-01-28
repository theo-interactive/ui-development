class App {

  cuId: number = 0;
  exId: number | null = null;
  isAni: boolean = false;
  btnTabMenuEls: NodeListOf<HTMLAnchorElement> | undefined;
  tabContentEls: NodeListOf<HTMLDivElement> | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.btnTabMenuEls = document.querySelectorAll('#tab-menu li a');
    this.tabContentEls = document.querySelectorAll('#tab-contents .tab-content');
  }

  addEvent() {
    if (!this.btnTabMenuEls) {
      return
    }
    this.btnTabMenuEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnTabMenuEl.bind(this));
    });
  }

  reset() {
    this.cuId = 0;
    this.exId = this.cuId;
  }

  handleClickBtnTabMenuEl(e: MouseEvent) {
    e.preventDefault();
    if (this.isAni || !this.btnTabMenuEls || !this.tabContentEls) {
      return
    }
    const el: HTMLAnchorElement = e.currentTarget as HTMLAnchorElement;
    if (el.classList.contains('selected')) {
      return
    }
    const id: number = [...this.btnTabMenuEls].indexOf(el);
    if (this.exId !== null) {
      this.btnTabMenuEls[this.exId].classList.remove('selected');
      this.tabContentEls[this.exId].classList.remove('selected');
    }
    this.cuId = id;
    this.isAni = true;
    this.btnTabMenuEls[this.cuId].classList.add('selected');
    this.tabContentEls[this.cuId].classList.add('selected');
    this.isAni = false;
    this.exId = this.cuId;
  }

}

new App();
