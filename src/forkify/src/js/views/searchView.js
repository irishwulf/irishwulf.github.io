class SearchView {
  #parentElem = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElem.querySelector('.search__field').value;
    this.#clearInput();

    return query;
  }

  #clearInput() {
    this.#parentElem.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentElem.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
