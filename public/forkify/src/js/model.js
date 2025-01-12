import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { API_KEY } from './secrets.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: null,
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export async function loadRecipe(recipeId) {
  try {
    const data = await AJAX(`${API_URL}/${recipeId}?key=${API_KEY}`);

    state.recipe = parseRecipeApiResponse(data);
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === recipeId
    );
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
      state.search.page = 1;
    });
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const pageSize = 10;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity / state.recipe.servings) * newServings)
  );
  state.recipe.servings = newServings;
}

export function setBookmark(recipe, isBookmarked) {
  if (isBookmarked) {
    state.bookmarks.push(recipe);
  } else {
    const index = state.bookmarks.findIndex(el => el.id === recipe.id);
    if (index !== -1) state.bookmarks.splice(index, 1);
  }

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = isBookmarked;

  persistBookmarks();
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function clearBookmarks() {
  localStorage.clear('bookmarks');
}

export async function uploadRecipe(newRecipeData) {
  const ingredients = Object.entries(newRecipeData)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(entry => parseIngredientEntry(entry));

  const uploadData = {
    title: newRecipeData.title,
    source_url: newRecipeData.sourceUrl,
    image_url: newRecipeData.image,
    publisher: newRecipeData.publisher,
    cooking_time: +newRecipeData.cookingTime,
    servings: +newRecipeData.servings,
    ingredients,
  };
  const data = await AJAX(`${API_URL}?key=${API_KEY}`, uploadData);
  state.recipe = parseRecipeApiResponse(data);
  setBookmark(state.recipe, true);
}

function parseIngredientEntry(entry) {
  const ingArr = entry[1].split(',').map(x => x.trim());
  if (ingArr.length !== 3)
    throw new Error(`Incorrect ingredient format for '${entry[0]}'.`);

  const [quantity, unit, description] = ingArr;
  return {
    quantity: quantity ? +quantity : null,
    unit,
    description,
  };
}

function parseRecipeApiResponse(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export function init() {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) ?? [];
}

init();
