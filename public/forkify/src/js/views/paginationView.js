import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElem = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElem.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(parseInt(btn.dataset.pagenum));
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const showPrev = this._data.page > 1;
    const showNext = this._data.page < numPages;

    // prettier-ignore
    return (
      (showPrev ?
        `
        <button class="btn--inline pagination__btn--prev" data-pagenum="${this._data.page - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${this._data.page - 1}</span>
        </button>
        `
        : '')
      + (showNext ?
        `
        <button class="btn--inline pagination__btn--next" data-pagenum="${this._data.page + 1}">
          <span>Page ${this._data.page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        `
        : '')
    );
  }
}

export default new PaginationView();
