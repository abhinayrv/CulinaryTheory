`use strict`;

const apiHost = "";
const apiSearchBytagEP = "/api/recipe/search?searchBy=tags&searchFor=";
const apiSearchBytitleEP = "/api/recipe/search?searchBy=title&searchFor=";
const apiSearchByIngEP = "/api/recipe/search?searchBy=ingredients&searchFor=";
const apiGetUsers = "/api/usernames?users=";
const recipeViewPageUrl = "/recipe?";

//login related varaibles
let userProfile;
let userLoggedIn = false;

//Initial Data required and helper variables
const tagsList = [
  "main-dish",
  "60-minutes-or-less",
  "30-minutes-or-less",
  "weeknight",
  "healthy",
  "low-protein",
  "desserts",
  "15-minutes-or-less",
  "lunch",
  "eggs-dairy",
  "appetizers",
  "american",
  "side-dishes",
];

let tagPicker = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let recipePageNumber = -1;
let recipePageCount = -1;
let searchVal = "";
let searchTypeVal = "";
let apiFetchUrl = "";
let apiSortFetchUrl = "";
let sortEnabled = false;
let searchNameDisplayMsg = "";

const [tag1, tag2, tag3, tag4, tag5, tag6, tag7] = tagPicker.map(
  (x) => tagsList[x]
);

//helper functions
const buildUrl = function (baseURL, paramsName, paramsValue) {
  let params = new URLSearchParams();
  params.append(paramsName, paramsValue);
  return `${baseURL}${params}`;
};

//func to hide/display elements
const hideDisplay = function (ele) {
  ele.classList.add("display-hide");
};
const showDisplay = function (ele) {
  ele.classList.remove("display-hide");
};

//Main navigation Bar
const homeBtn = document.getElementById("home-btn");
const aboutUsBtn = document.getElementById("about-us-btn");
const recipeCreateBtn = document.getElementById("recipe-create-btn");
const loginSignUpBtn = document.getElementById("login-signup-btn");
const accountBtn = document.getElementById("account-btn");

//func to activate or deactivate main nav buttons
const activMainNavbtn = function (btn) {
  btn.classList.add("nav-link-active");
};
const deactivMainNavbtn = function (btn) {
  btn.classList.remove("nav-link-active");
};

//func to setup Main Navigation Bar

homeBtn.addEventListener("click", function (e) {
  window.location.reload();
});

loginSignUpBtn.addEventListener("click", function (e) {
  e.preventDefault();
  showDisplay(loginSection);
  activMainNavbtn(loginSignUpBtn);
  deactivMainNavbtn(homeBtn);

  //login form Reset
  userEmailInput.value = userPasswordInput.value = "";
  userEmailInput.blur();
  userPasswordInput.blur();
  hideDisplay(loginErrDisplay);
});

//login and other details
const loginSection = document.querySelector(".login");
const loginClsBtn = document.getElementById("login-frm-close");
const loginErrDisplay = document.getElementById("login-err-msg");
const userEmailInput = document.getElementById("user-email");
const userPasswordInput = document.getElementById("user-password");
const loginBtn = document.getElementById("login-btn");
const signupOpenBtn = document.getElementById("signup-open-btn");

signupOpenBtn.addEventListener("click", function (e) {
  e.preventDefault();
  hideDisplay(loginSection);
  showDisplay(signupForm);
});

const signupForm = document.querySelector(".signup-ov");
const signupFormClose = document.getElementById("signup-frm-close");
signupFormClose.addEventListener("click", function (e) {
  e.preventDefault();
  hideDisplay(signupForm);
});

const doLogin = async function () {
  let emailId = userEmailInput.value;
  let passWord = userPasswordInput.value;
  let urlencoded = new URLSearchParams();
  urlencoded.append("email", emailId);
  urlencoded.append("password", passWord);

  let requestOptions = {
    method: "POST",
    body: urlencoded,
  };
  try {
    let loginRespose = await fetch(`${apiHost}/api/login`, requestOptions).then(
      (response) => response.json()
    );
    if (!loginRespose.success) throw new Error(loginRespose.message);
    loginSessionCheck();
    userEmailInput.value = userPasswordInput.value = "";
    userEmailInput.blur();
    userPasswordInput.blur();
    hideDisplay(loginErrDisplay);
    hideDisplay(loginSection);
  } catch (error) {
    console.log("error", error.message);
    userEmailInput.value = userPasswordInput.value = "";
    userEmailInput.focus();
    loginErrDisplay.textContent = error.message;
    showDisplay(loginErrDisplay);
  }
};

const loginSessionCheck = async function () {
  try {
    let loginCheckRes = await fetch(`${apiHost}/api/myprofile`).then(
      (response) => response.json()
    );

    userLoggedIn = loginCheckRes.success;
    if (!userLoggedIn) throw new Error(loginCheckRes.message);
    ({ data: userProfile } = loginCheckRes);

    updateMainNav();
  } catch (error) {
    console.log(error.message);
  }
};
loginSessionCheck();

const updateMainNav = function () {
  activMainNavbtn(homeBtn);
  if (userLoggedIn) {
    showDisplay(recipeCreateBtn.parentElement);
    showDisplay(accountBtn.parentElement);
    hideDisplay(loginSignUpBtn.parentElement);

    accountBtn.querySelector("#nav-user-img").src = userProfile.profile_image;
    accountBtn.querySelector("#nav-auth-name").textContent =
      userProfile.user_name;

    //setting href
    recipeCreateBtn.setAttribute("href", "/create");
    accountBtn.setAttribute("href", "/myprofile");
    aboutUsBtn.setAttribute("href", "/about");
  } else {
    hideDisplay(recipeCreateBtn.parentElement);
    hideDisplay(accountBtn.parentElement);
    showDisplay(loginSignUpBtn.parentElement);
    aboutUsBtn.setAttribute("href", "/about");
  }
};

loginClsBtn.addEventListener("click", function () {
  hideDisplay(loginSection);
  activMainNavbtn(homeBtn);
  deactivMainNavbtn(loginSignUpBtn);
});

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  doLogin();
});

//page related apis

const defAuthorData = {
  user_name: "The Culinary Theory",
  profile_image:
    "https://test-bucket-culinary.s3.amazonaws.com/3387e4c381f682b9f3b2104b0a4433f7.jpg",
};
const defRecipeCardHtml = `<a href="#" class="recipe-card-btn">
<div class="recipe-card flex-column">
  <!-- ------------------- Image ------------------- -->
  <div class="rc-image-container">
    <img
      src="./../img/placeHolderImage.jpeg"
      alt="Photo of food"
      class="rc-food-image"
    />
  </div>
  <!-- ------------------- Recipe content ------------------- -->
  <div class="rc-content-container flex-column">
    <div class="rc-title-container">
      <p class="rc-title p-main-semibold">
        No recipes to display
      </p>
    </div>
    <div class="rc-author-details flex-row">
      <div class="rc-auth-img-container">
        <img
          src="./../img/personPHpreview.jpeg"
          alt="Photo of Author"
          class="rc-auth-image"
        />
      </div>
      <p class="rc-auth-name p-main-semibold">
        The Culinary Theory
      </p>
    </div>
    <div class="rc-action-btns flex-row">
      <div class="rc-action-set flex-row">
        <div class="like-box flex-row">
          <p class="like-count p-main-semibold">0</p>
          <div>
            <span
              class="material-icons-outlined like-icon rc-noRecipe-c"
              >thumb_up</span
            >
            <span
              class="material-icons like-icon icon-inactive icon-filled"
              >thumb_up</span
            >
          </div>
        </div>
        <div class="dislike-box flex-row">
          <p class="dislike-count p-main-semibold">0</p>
          <div>
            <span
              class="material-icons-outlined dislike-icon rc-noRecipe-c"
              >thumb_down</span
            >
            <span
              class="material-icons dislike-icon icon-inactive icon-filled"
              >thumb_down</span
            >
          </div>
        </div>
      </div>
      <div class="rc-action-set flex-row">
        <div class="rc_action_link">
          <span
            class="material-icons-outlined bookmark-icon rc-noRecipe-c"
            >bookmark_outline</span
          >
          <span
            class="material-icons bookmark-icon icon-filled icon-inactive"
            >bookmark</span
          >
        </div>
      </div>
    </div>
  </div>
  <!-- ------------------- Recipe Indicator ------------------- -->
  <div class="rc-food-type-indicate rc-noRecipe"></div>
</div>
</a>`;

const fetchRecipeData = async function (apiUrl, contentBox, search) {
  try {
    let { data: recipeSetData } = await fetch(apiUrl).then((res) => res.json());
    if (search) {
      recipePageNumber = recipeSetData.page;
      recipePageCount = recipeSetData.total_pages;
      console.log(recipePageNumber, recipePageCount);
      if (recipePageNumber + 1 === recipePageCount) {
        hideDisplay(loadMoreBtn);
        showDisplay(loadMoreMsg);
      }
    }
    if (!recipeSetData.total_pages) throw new Error(`No Recipes found`);
    let recipesDataArr = recipeSetData.data;

    const userIdArr = recipesDataArr.map((recipe) => recipe.user_id);

    const { data: userSetData } = await fetch(
      `${apiHost}${apiGetUsers}${JSON.stringify(userIdArr)}`
    ).then((res) => res.json());

    // throw new Error("This is for Testing");
    if (!search || recipePageNumber === 0) contentBox.innerHTML = "";
    recipesDataArr.forEach((recipeData) => {
      let authorData = userSetData[`${recipeData.user_id}`];
      if (!authorData) authorData = defAuthorData;
      renderRecipeCard(recipeData, authorData, contentBox);
    });
  } catch (e) {
    console.error(e);
    contentBox.innerHTML = "";
    let recipeErrorCardHtml = `<a href="#" class="recipe-card-btn">
    <div class="recipe-card flex-column">
      <!-- ------------------- Image ------------------- -->
      <div class="rc-image-container">
        <img
          src="./../img/placeHolderImage.jpeg"
          alt="Photo of food"
          class="rc-food-image"
        />
      </div>
      <!-- ------------------- Recipe content ------------------- -->
      <div class="rc-content-container flex-column">
        <div class="rc-title-container">
          <p class="rc-title p-main-semibold">
            ${e.message}
          </p>
        </div>
        <div class="rc-author-details flex-row">
          <div class="rc-auth-img-container">
            <img
              src="./../img/personPHpreview.jpeg"
              alt="Photo of Author"
              class="rc-auth-image"
            />
          </div>
          <p class="rc-auth-name p-main-semibold">
            The Culinary Theory
          </p>
        </div>
        <div class="rc-action-btns flex-row">
          <div class="rc-action-set flex-row">
            <div class="like-box flex-row">
              <p class="like-count p-main-semibold">0</p>
              <div>
                <span
                  class="material-icons-outlined like-icon rc-noRecipe-c"
                  >thumb_up</span
                >
                <span
                  class="material-icons like-icon icon-inactive icon-filled"
                  >thumb_up</span
                >
              </div>
            </div>
            <div class="dislike-box flex-row">
              <p class="dislike-count p-main-semibold">0</p>
              <div>
                <span
                  class="material-icons-outlined dislike-icon rc-noRecipe-c"
                  >thumb_down</span
                >
                <span
                  class="material-icons dislike-icon icon-inactive icon-filled"
                  >thumb_down</span
                >
              </div>
            </div>
          </div>
          <div class="rc-action-set flex-row">
            <div class="rc_action_link">
              <span
                class="material-icons-outlined bookmark-icon rc-noRecipe-c"
                >bookmark_outline</span
              >
              <span
                class="material-icons bookmark-icon icon-filled icon-inactive"
                >bookmark</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- ------------------- Recipe Indicator ------------------- -->
      <div class="rc-food-type-indicate rc-noRecipe"></div>
    </div>
    </a>`;
    contentBox.insertAdjacentHTML("afterbegin", recipeErrorCardHtml);
    if (search) {
      hideDisplay(loadMoreBtn);
      showDisplay(loadMoreMsg);
    }
  }
};

const renderRecipeCard = function (recipeData, userData, contentBox) {
  let recipeCardHtml = `<a href="${buildUrl(
    recipeViewPageUrl,
    "recipe_id",
    recipeData.recipe_id
  )}" class="recipe-card-btn">
  <div class="recipe-card flex-column">
    <!-- ------------------- Image ------------------- -->
    <div class="rc-image-container">
      <img
        src="${recipeData.image_url}"
        alt="Photo of food"
        class="rc-food-image"
      />
    </div>
    <!-- ------------------- Recipe content ------------------- -->
    <div class="rc-content-container flex-column">
      <div class="rc-title-container">
        <p class="rc-title p-main-semibold">
        ${recipeData.title.toUpperCase()}
        </p>
      </div>
      <div class="rc-author-details flex-row">
        <div class="rc-auth-img-container">
          <img
            src="${userData.profile_image}"
            alt="Photo of Author"
            class="rc-auth-image"
          />
        </div>
        <p class="rc-auth-name p-main-semibold">
          ${userData.user_name}
        </p>
      </div>
      <div class="rc-action-btns flex-row">
        <div class="rc-action-set flex-row">
          <div class="like-box flex-row">
            <p class="like-count p-main-semibold">${recipeData.likes}</p>
            <div>
              <span class="material-icons-outlined like-icon"
                >thumb_up</span
              >
              <span
                class="material-icons like-icon icon-inactive icon-filled"
                >thumb_up</span
              >
            </div>
          </div>
          <div class="dislike-box flex-row">
            <p class="dislike-count p-main-semibold">${recipeData.dislikes}</p>
            <div>
              <span class="material-icons-outlined dislike-icon"
                >thumb_down</span
              >
              <span
                class="material-icons dislike-icon icon-inactive icon-filled"
                >thumb_down</span
              >
            </div>
          </div>
        </div>
        <div class="rc-action-set flex-row">
          <div class="rc_action_link">
            <span class="material-icons-outlined bookmark-icon"
              >bookmark_outline</span
            >
            <span
              class="material-icons bookmark-icon icon-filled icon-inactive"
              >bookmark</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="rc-food-type-indicate ${
      recipeData.dietary_preferences === "contains egg"
        ? "rc-egg"
        : recipeData.dietary_preferences === "vegetarian"
        ? "rc-veg"
        : "rc-nonveg"
    }"></div>
  </div>
</a>`;
  contentBox.insertAdjacentHTML("beforeend", recipeCardHtml);
};

const fetchRecipeBySerch = function (
  apiFetUrl,
  containerBox,
  searchNameDisMsg
) {
  hideDisplay(secCardCatDisplay);
  showDisplay(secSearchDisplay);
  hideDisplay(quickLinkBar);
  showDisplay(sortLinkBar);
  hideDisplay(loadMoreMsg);
  showDisplay(loadMoreBtn);
  deactivMainNavbtn(homeBtn);
  searchNameDisplay.textContent = searchNameDisMsg;
  fetchRecipeData(apiFetUrl, containerBox, true);
};

//Search Box funtions
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    //changing the sections
    sortEnabled = false;
    searchVal = this.value;
    searchTypeVal = searchType.value;
    this.value = "";
    this.blur();

    searchNameDisplayMsg = `Search Results - "${searchVal}"`;
    apiFetchUrl = `${apiHost}${
      searchTypeVal === "tags"
        ? apiSearchBytagEP
        : searchTypeVal === "title"
        ? apiSearchBytitleEP
        : apiSearchByIngEP
    }${searchVal.toLowerCase()}`;

    fetchRecipeBySerch(apiFetchUrl, searchRCardBox, searchNameDisplayMsg);
  }
});

// Search Box nav links
// sorting Links
const sortLinkBar = document.querySelector(".js-result-sort-bar");
const srtByLikeBtn = document.querySelector(".js-srtByLike");
const srtByDislikeBtn = document.querySelector(".js-srtByDislike");
// const srtAsc = document.querySelector(".js-srtByAsc");
// const srtDesc = document.querySelector(".js-srtDesc");

srtByLikeBtn.addEventListener("click", function (e) {
  sortEnabled = true;
  apiSortFetchUrl = `${apiFetchUrl}&sortBy=likes&sortAsc=-1`;
  fetchRecipeBySerch(apiSortFetchUrl, searchRCardBox, searchNameDisplayMsg);
});
srtByDislikeBtn.addEventListener("click", function (e) {
  sortEnabled = true;
  apiSortFetchUrl = `${apiFetchUrl}&sortBy=dislikes&sortAsc=1`;
  fetchRecipeBySerch(apiSortFetchUrl, searchRCardBox, searchNameDisplayMsg);
});

// quickLinks
const quickLinkBar = document.querySelector(".js-quickLink-bar");
const quickLink1 = document.querySelector(".js-qc-1");
const quickLink2 = document.querySelector(".js-qc-2");
const quickLink3 = document.querySelector(".js-qc-3");

const setQuickLinks = function () {
  // quickLink1.getElementsByTagName("p").textContent = tag5;
  quickLink1.textContent = tag5.toUpperCase();
  quickLink1.dataset.tagName = tag5;
  quickLink2.textContent = tag6.toUpperCase();
  quickLink2.dataset.tagName = tag6;
  quickLink3.textContent = tag7.toUpperCase();
  quickLink3.dataset.tagName = tag7;
};
setQuickLinks();
quickLink1.addEventListener("click", function () {
  sortEnabled = false;
  searchVal = quickLink1.dataset.tagName;
  searchTypeVal = "tags";
  searchNameDisplayMsg = `${searchVal.toUpperCase()}`;
  apiFetchUrl = `${apiHost}${
    searchTypeVal === "tags"
      ? apiSearchBytagEP
      : searchTypeVal === "title"
      ? apiSearchBytitleEP
      : apiSearchByIngEP
  }${searchVal.toLowerCase()}`;

  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, searchNameDisplayMsg);
});

quickLink2.addEventListener("click", function () {
  sortEnabled = false;
  searchVal = quickLink2.dataset.tagName;
  searchTypeVal = "tags";
  searchNameDisplayMsg = `${searchVal.toUpperCase()}`;
  apiFetchUrl = `${apiHost}${
    searchTypeVal === "tags"
      ? apiSearchBytagEP
      : searchTypeVal === "title"
      ? apiSearchBytitleEP
      : apiSearchByIngEP
  }${searchVal.toLowerCase()}`;

  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, searchNameDisplayMsg);
});

quickLink3.addEventListener("click", function () {
  sortEnabled = false;
  searchVal = quickLink3.dataset.tagName;
  searchTypeVal = "tags";
  searchNameDisplayMsg = `${searchVal.toUpperCase()}`;
  apiFetchUrl = `${apiHost}${
    searchTypeVal === "tags"
      ? apiSearchBytagEP
      : searchTypeVal === "title"
      ? apiSearchBytitleEP
      : apiSearchByIngEP
  }${searchVal.toLowerCase()}`;

  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, searchNameDisplayMsg);
});

//Section elements
const secCardCatDisplay = document.querySelector(".js-sec-card-cat-display");
const secSearchDisplay = document.querySelector(".js-sec-search-display");

//Handling Main Recipe Card Display Section
//catalogue name
const catalogueName1 = document.querySelector(".js-cat-name-1");
catalogueName1.textContent = tag1.toUpperCase();
const catalogueName2 = document.querySelector(".js-cat-name-2");
catalogueName2.textContent = tag2.toUpperCase();
const catalogueName3 = document.querySelector(".js-cat-name-3");
catalogueName3.textContent = tag3.toUpperCase();
const catalogueName4 = document.querySelector(".js-cat-name-4");
catalogueName4.textContent = tag4.toUpperCase();

//catalogue box
const catalogueBox1 = document.querySelector(".js-cd-box-1");
const catalogueBox2 = document.querySelector(".js-cd-box-2");
const catalogueBox3 = document.querySelector(".js-cd-box-3");
const catalogueBox4 = document.querySelector(".js-cd-box-4");

fetchRecipeData(`${apiHost}${apiSearchBytagEP}${tag1}`, catalogueBox1);
fetchRecipeData(`${apiHost}${apiSearchBytagEP}${tag2}`, catalogueBox2);
fetchRecipeData(`${apiHost}${apiSearchBytagEP}${tag3}`, catalogueBox3);
fetchRecipeData(`${apiHost}${apiSearchBytagEP}${tag4}`, catalogueBox4);

//Handling search Box section
const loadMoreMsg = document.querySelector(".js-load-more-msg");
const loadMoreBtn = document.querySelector(".js-load-more-btn");
const searchNameDisplay = document.querySelector(".js-search-name-dis");
const searchRCardBox = document.querySelector(".js-search-rc-box");

loadMoreBtn.addEventListener("click", function (e) {
  let apiFetUrl;
  if (sortEnabled) {
    apiFetUrl = `${apiSortFetchUrl}&pageNumber=${recipePageNumber + 1}`;
  } else {
    apiFetUrl = `${apiFetchUrl}&pageNumber=${recipePageNumber + 1}`;
  }

  fetchRecipeBySerch(apiFetUrl, searchRCardBox, searchNameDisplayMsg);
});

let doLogout = function () {
  fetch(`${apiHost}/api/logout`)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
