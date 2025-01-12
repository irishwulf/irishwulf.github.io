import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

export default class View {
  _parentElem;
  _data;
  _errorMessage;
  _message;

  /**
   * Translate the received data to markup, and render it to the DOM.
   * @param {Object | Object[]} data The data to be rendered, e.g. a recipe
   * @param {boolean} [doRender=true] If true, renders the generated markup; if false, just returns the generated markup.
   * @returns {string} The generated markup
   * @this {Object} View instance
   * @author Seth Gilchrist
   */
  render(data, doRender = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (doRender) {
      this._clear();
      this._parentElem.insertAdjacentHTML('afterbegin', markup);
    }
    return markup;
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElem.querySelectorAll('*'));

    // Update changed text
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl)) {
        if (newEl.firstChild?.nodeValue.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElem.innerHTML = '';
  }

  _generateMarkup() {}
}
