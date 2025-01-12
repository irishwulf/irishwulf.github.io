import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

module.hot?.accept();

async function controlRecipes() {
  try {
    const hashId = window.location.hash.slice(1);

    if (!hashId) return;

    // Load recipe
    recipeView.renderSpinner();
    await model.loadRecipe(hashId);

    // Render recipe
    recipeView.render(model.state.recipe);
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}

async function controlSearchResults() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    controlPagination(1);
  } catch (err) {
    resultsView.renderError();
  }
}

async function controlPagination(pageNum) {
  resultsView.render(model.getSearchResultsPage(pageNum));
  paginationView.render(model.state.search);
}

async function controlServings(numServings) {
  model.updateServings(numServings);

  recipeView.update(model.state.recipe);
}

function controlToggleBookmarked(isBookmarked) {
  model.setBookmark(model.state.recipe, !model.state.recipe.bookmarked);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipeData) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipeData);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerToggleBookmark(controlToggleBookmarked);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  model.init();
}

init();
