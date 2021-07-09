// const auth = "1dea5c571b2d4d97851d0a8b848f4479";
// const auth = "7e62daec2fac48a7be42615812f3df98";
const auth = "485e76e7fda5407e9cc3385e554a67c5";
// const auth = "fdee1eda935c40aa8311451bc8d3157f";

const searchInputs = document.querySelectorAll(".search-input");
const searchForms = document.querySelectorAll(".search-form");
const gallery = document.querySelector(".gallery");
const heroTxt = document.querySelector(".hero h2");
const exit = document.querySelector(".close");
const popup = document.querySelector(".popup");
const moreBtn = document.querySelector(".more");
const container = document.querySelector(".popup-container");
let fetchLink;
let searchValue;
let perPage = 10;
let currentSearch;
let cardsElm = [];

//EVENT LISTENER =============================================================
window.addEventListener("scroll", animateNav);
exit.addEventListener("click", openPopup);
moreBtn.addEventListener("click", loadMore);

searchInputs.forEach((searchInput) => {
  searchInput.addEventListener("input", updateInput);
});
searchForms.forEach((searchForm) => {
  searchForm.addEventListener("submit", (e) => {
    searchRecipes(searchValue);
    e.preventDefault();
    currentSearch = searchValue;
  });
});

//FUNCTION===================================================================
function updateInput(e) {
  // console.log(e.target.value);
  searchValue = e.target.value;
}

function clear() {
  gallery.innerHTML = "";
  searchInputs.forEach((input) => {
    input.value = "";
  });
  cardsElm = [];
}
function generateSearch(recipe) {
  const foodImg = recipe.image;
  const title = recipe.title;
  const ingredients = recipe.extendedIngredients;
  const instruction = recipe.analyzedInstructions;
  const event = 0;
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img class="food-img" src="${foodImg}" alt="food image">
    <div class="card-title">
      <h4>${title}</h4>
    </div>`;
  gallery.appendChild(card);
  cardsElm.push({
    image: foodImg,
    title: title,
    ingredients: ingredients,
    instruction: instruction,
    event: event,
  });
}

async function searchRecipes(query) {
  let id;
  clear();
  fetchLink = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${auth}&query=${query}`;
  const data = await fetchApi(fetchLink);
  data.results.forEach(async (detail) => {
    id = detail.id;
    fetchLink = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${auth}`;
    const detailRecipe = await fetchApi(fetchLink);
    // console.log(detailRecipe);
    generateSearch(detailRecipe);
    cardListener();
  });
}

function openPopup() {
  if (!popup.classList.contains("active")) {
    popup.classList.add("active");
    const body = document.querySelector("body");
    document.body.classList.add("hide");
  } else {
    popup.classList.remove("active");
    document.body.classList.remove("hide");
  }
}

function animateNav() {
  const heroPos = heroTxt.getBoundingClientRect().top;
  const logo = document.querySelector(".title h3");
  const nav = document.querySelector("nav");
  const searchNav = document.querySelector(".search-nav");
  if (heroPos < 0) {
    nav.style.background = "#f7f6e7";
    searchNav.style.display = "block";
  } else {
    nav.style.background = "transparent";
    searchNav.style.display = "none";
  }
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePopup(card) {
  const foodImg = card.image;
  const title = card.title;
  const ingredients = card.ingredients;
  const instructions = card.instruction;

  container.innerHTML = `
  <div class="popup-img">
    <img
    src="${foodImg}"
    alt=""
  />
  </div>
  <h3>${title}</h3>
  <div class="popup-txt">
    <div class="ingredient-left">
      <ul></ul>
    </div>
    <div class="ingredient-right">
      <ul></ul>
    </div>
  </div>
  <div class="popup-step">
    <h4>How to make</h4>
      <ol></ol>
  </div>`;

  const ingLeft = document.querySelector(".ingredient-left ul");
  const ingRight = document.querySelector(".ingredient-right ul");
  ingredients.forEach((ing) => {
    const ingredient = document.createElement("li");
    const amount = document.createElement("li");
    ingredient.innerText = `${ing.name}`;
    amount.innerHTML = `${ing.measures.metric.amount} ${ing.measures.metric.unitShort}`;
    ingLeft.appendChild(ingredient);
    ingRight.appendChild(amount);
  });

  const steps = document.querySelector(".popup-step ol");
  instructions.forEach((instruction) => {
    instruction.steps.forEach((step) => {
      const list = document.createElement("li");
      list.innerHTML = `${step.step}`;
      steps.appendChild(list);
    });
  });
}

function generateCard(data) {
  // console.log(data);
  data.recipes.forEach((recipe) => {
    const foodImg = recipe.image;
    const title = recipe.title;
    const ingredients = recipe.extendedIngredients;
    const instruction = recipe.analyzedInstructions;
    const event = 0;
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <img class="food-img" src="${foodImg}" alt="food image">
    <div class="card-title">
      <h4>${title}</h4>
    </div>`;
    gallery.appendChild(card);
    cardsElm.push({
      image: foodImg,
      title: title,
      ingredients: ingredients,
      instruction: instruction,
      event: event,
    });
  });
}

function cardListener() {
  const cards = document.querySelectorAll(".card");
  // console.log(cards);
  cards.forEach((card, index) => {
    if (cardsElm[index].event === 0) {
      cardsElm[index].event = 1;
      card.addEventListener("click", () => {
        document.body.classList.add("hide");
        openPopup();
        generatePopup(cardsElm[index]);
      });
    }
  });
}

async function randomRecipe() {
  fetchLink = `https://api.spoonacular.com/recipes/random?apiKey=${auth}&number=10`;
  const data = await fetchApi(fetchLink);
  generateCard(data);
  cardListener();
}

async function loadMore() {
  perPage += 5;
  if (currentSearch) {
    fetchLink = fetchLink = `https://api.spoonacular.com/recipes/random?apiKey=${auth}&number=${perPage}`;
  } else {
    fetchLink = `https://api.spoonacular.com/recipes/random?apiKey=${auth}&number=10`;
  }
  const data = await fetchApi(fetchLink);
  generateCard(data);
  cardListener();
}

randomRecipe();
