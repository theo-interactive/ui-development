// @ts-ignore
import nl2br from 'nl2br'

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min';

type Datum = {
  city: string
  abbr: string
  title: string
  description: string
  imageUrl: string
}

const DATA: Datum[] = [
  {
    city: 'London',
    abbr: 'Tate Modern',
    title: 'Tate Modern',
    description: 'Tate Modern is an art gallery located in London.\nIt houses the United Kingdom\'s national collection of international modern and contemporary art, and forms part of the Tate group together with Tate Britain, Tate Liverpool and Tate St Ives.',
    imageUrl: 'https://source.unsplash.com/X5jEoe36ukA/1200x800'
  },
  {
    city: 'Paris',
    abbr: 'Louvre Museum',
    title: 'Louvre Museum',
    description: 'The Louvre Museum, is the world\'s most-visited museum, and a historic landmark in Paris, France.\nIt is the home of some of the best-known works of art, including the Mona Lisa and the Venus de Milo.',
    imageUrl: 'https://source.unsplash.com/GCfE4fl7tIQ/1200x800'
  },
  {
    city: 'New York',
    abbr: 'MoMA',
    title: 'MoMA – The Museum of Modern Art',
    description: 'The Museum of Modern Art (MoMA) is an art museum located in Midtown Manhattan, New York City, on 53rd Street between Fifth and Sixth Avenues.\nIt plays a major role in developing and collecting modern art, and is often identified as one of the largest and most influential museums of modern art in the world.\nMoMA\'s collection offers an overview of modern and contemporary art, including works of architecture and design, drawing, painting, sculpture, photography, prints, illustrated and artist\'s books, film, and electronic media.',
    imageUrl: 'https://source.unsplash.com/eTEaDL15tf8/1200x800'
  },
  {
    city: 'Amsterdam',
    abbr: 'Van Gogh Museum',
    title: 'Van Gogh Museum',
    description: 'The Van Gogh Museum is a Dutch art museum dedicated to the works of Vincent van Gogh and his contemporaries in the Museum Square in Amsterdam South.\nThe museum opened on 2 June 1973, and its buildings were designed by Gerrit Rietveld and Kisho Kurokawa.',
    imageUrl: 'https://source.unsplash.com/DfplaIXkua8/1200x800'
  },
  {
    city: 'Wien',
    abbr: 'Leopold Museum',
    title: 'Leopold Museum',
    description: 'The Leopold Museum, housed in the Museumsquartier in Vienna, Austria, is home to one of the largest collections of modern Austrian art, featuring artists such as Egon Schiele, Gustav Klimt, Oskar Kokoschka and Richard Gerstl.\nIt contains the world\'s largest Egon Schiele Collection.',
    imageUrl: 'https://source.unsplash.com/cMHoBwFXPeI/1200x800'
  }
]

class App {

  imageUrls: string[] = []
  isLoaded: Boolean = false
  cuId: number | null = null
  exId: number | null = null
  wrapEl: HTMLDivElement | null | undefined;
  accordionEl: HTMLDivElement | null | undefined;
  accordionViewEl: NodeListOf<HTMLDivElement> | undefined;
  accordionCollapseEls: NodeListOf<HTMLDivElement> | undefined;
  btnCloseEls: NodeListOf<HTMLButtonElement> | undefined;

  constructor() {
    this.layout();
    this.create();
    this.preload();
    this.loadedLayout();
    this.addEvent();
    this.reset();
  }

  layout() {
    this.wrapEl = document.querySelector('#wrap') as HTMLDivElement;
  }

  create() {
    if (!this.wrapEl) {
      return
    }
    let html = '';
    html += '<div id="accordion" class="accordion">';
    DATA.forEach((datum, idx) => {
      const { city, abbr, title, description, imageUrl } = datum
      html += `<div id="accordion-item-${idx + 1}" class="accordion-item">`;
      html +=     `<div class="accordion-collapse" role="presentation"><p>${abbr}<span data-collapse="${abbr}"></span></p></div>`;
      html +=     '<div class="accordion-view">';
      html +=         `<h2 class="eyebrow">${city}</h2>`;
      html +=         `<h3 class="headline">${title}</h3>`;
      html +=         `<p class="copy">${nl2br(description)}</p>`;
      html +=     '</div>';
      html +=     '<div class="accordion-image">';
      html +=         `<figure><img src="${imageUrl}" alt="${title}" /></figure>`;
      html +=     '</div>';
      html +=     '<button type="button" class="btn-close"><span><i class="fa-solid fa-xmark"></i></span></button>';
      html += '</div>';
    })
    html += '</div>';
    this.wrapEl.innerHTML = html;
  }

  preload() {
    if (!this.wrapEl) {
      return
    }
    this.imageUrls = DATA.map((datum) => datum.imageUrl);
    let loadedCheckCount = 0;
    const max = this.imageUrls.length;
    if (max > 0) {
      this.imageUrls.forEach((imageUrl) => {
        const img = new Image();
        img.onload = () => {
          if (!this.wrapEl) {
            return
          }
          loadedCheckCount++;
          if (loadedCheckCount >= max) {
            this.wrapEl.classList.remove('inactive');
          }
        }
        img.src = imageUrl;
      })
      return
    }
    this.wrapEl.classList.remove('inactive');
  }

  loadedLayout() {
    if (!this.wrapEl) {
      return
    }
    this.accordionEl = this.wrapEl.querySelector('#accordion') as HTMLDivElement;
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
