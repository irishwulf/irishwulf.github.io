import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElem = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _windowElem = document.querySelector('.add-recipe-window');
  _overlayElem = document.querySelector('.overlay');
  _btnOpenElem = document.querySelector('.nav__btn--add-recipe');
  _btnCloseElem = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.#addHandlerShowWindow();
    this.#addHandlerHideWindow();
  }

  #addHandlerShowWindow() {
    this._btnOpenElem.addEventListener('click', this.toggleWindow.bind(this));
  }

  #addHandlerHideWindow() {
    this._btnCloseElem.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayElem.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElem.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(e.target)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  toggleWindow() {
    this._overlayElem.classList.toggle('hidden');
    this._windowElem.classList.toggle('hidden');
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
