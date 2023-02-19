import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min';

class App {

  cuId: number | null = null
  exId: number | null = null
  accordionEl: HTMLDivElement | null | undefined;
  accordionViewEl: NodeListOf<HTMLDivElement> | undefined;
  accordionCollapseEls: NodeListOf<HTMLDivElement> | undefined;
  btnCloseEls: NodeListOf<HTMLButtonElement> | undefined;

  constructor() {
    this.layout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.accordionEl = document.querySelector('#accordion') as HTMLDivElement;
    this.accordionViewEl = this.accordionEl.querySelectorAll('.accordion-item');
    this.accordionCollapseEls = this.accordionEl.querySelectorAll('.accordion-collapse');
    this.btnCloseEls = this.accordionEl.querySelectorAll('.btn-close');
  }

  addEvent() {
    if (!this.accordionCollapseEls || !this.btnCloseEls) {
      return
    }
    this.accordionCollapseEls.forEach((el) => {
      el.addEventListener('click', this.handleClickAccordionCollapseEl.bind(this));
    });
    this.btnCloseEls.forEach((el) => {
      el.addEventListener('click', this.handleClickBtnCloseEl.bind(this));
    });
  }

  reset() {
    this.cuId = 0;
    this.exId = this.cuId;
  }

  handleClickAccordionCollapseEl(e: MouseEvent) {
    e.preventDefault();
    if (!this.accordionCollapseEls || !this.accordionViewEl) {
      return
    }
    const el = e.currentTarget as HTMLDivElement;
    const viewEl = el.closest('.accordion-item');
    if (!viewEl || viewEl.classList.contains('selected')) {
      return
    }
    this.cuId = [...this.accordionCollapseEls].indexOf(el);
    if (this.exId !== null) {
      this.accordionViewEl.item(this.exId).classList.remove('selected');
    }
    viewEl.classList.add('selected');
    this.exId = this.cuId;
  }

  handleClickBtnCloseEl(e: MouseEvent) {
    e.preventDefault();
    if (!this.accordionViewEl) {
      return
    }
    const el = e.currentTarget as HTMLDivElement;
    const viewEl = el.closest('.accordion-item');
    if (!viewEl || !viewEl.classList.contains('selected')) {
      return
    }
    if (this.exId !== null) {
      this.accordionViewEl.item(this.exId).classList.remove('selected');
    }
    this.cuId = null;
    this.exId = this.cuId;
  }

}

new App();
