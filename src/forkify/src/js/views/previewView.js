import View from './View.js';

import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentElem = '';

  _generateMarkup() {
    const result = this._data;
    const activeId = window.location.hash.slice(1);
    return `
          <li class="preview">
            <a class="preview__link ${
              result.id === activeId ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
  `;
  }
}

export default new PreviewView();
