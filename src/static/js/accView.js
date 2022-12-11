`use strict`;

const apiHost = "";
const apiMyRecipes = "/api/recipe/myrecipes";
const apiSavedRecipes = "/api/bookmarks";
const apiDrafts = "/api/recipe/search?searchBy=ingredients&searchFor=";
const apiGetUsers = "/api/usernames?users=";
const recipeViewPageUrl = "/recipe?";

//login related varaibles
let userProfile;
let userLoggedIn = false;
let userPremium = false;

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
let bookmarks = false;

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

const editProfileForm = document.querySelector(".edit-profile-form");
const editFrmClose = document.getElementById("edit-frm-close");
editFrmClose.addEventListener("click", function () {
  hideDisplay(editProfileForm);
});
//func to activate or deactivate main nav buttons
const activMainNavbtn = function (btn) {
  btn.classList.add("nav-link-active");
};
const deactivMainNavbtn = function (btn) {
  btn.classList.remove("nav-link-active");
};

const activSecNavbtn = function (btn) {
  btn.classList.add("nav-btn-active");
};
const deactivSecNavbtn = function (btn) {
  btn.classList.remove("nav-btn-active");
};
//func to setup Main Navigation Bar

accountBtn.addEventListener("click", function (e) {
  window.location.reload();
});

const loginSessionCheck = async function () {
  try {
    let loginCheckRes = await fetch(`${apiHost}/api/myprofile`).then(
      (response) => response.json()
    );

    userLoggedIn = loginCheckRes.success;
    if (!userLoggedIn) throw new Error(loginCheckRes.message);
    ({ data: userProfile } = loginCheckRes);

    updateMainNav();
    doProfileDisplay();
  } catch (error) {
    console.log(error.message);
    window.location.href = "/home";
  }
};

const updateMainNav = function () {
  activMainNavbtn(accountBtn);
  if (userLoggedIn) {
    showDisplay(recipeCreateBtn.parentElement);
    showDisplay(accountBtn.parentElement);
    hideDisplay(loginSignUpBtn.parentElement);

    accountBtn.querySelector("#nav-user-img").src = userProfile.profile_image;
    accountBtn.querySelector("#nav-auth-name").textContent =
      userProfile.user_name;

    //setting href
    recipeCreateBtn.setAttribute("href", "/createrecipe");
    accountBtn.setAttribute("href", "/myprofile");
    aboutUsBtn.setAttribute("href", "/about");
    homeBtn.setAttribute("href", "/home");
  } else {
    window.location.href = "/home";
  }
};

const onRelodNavUpdates = function () {
  activMainNavbtn(profileViewBtn);
  showDisplay(recipeDisSec);
  bookmarks = false;
  apiFetchUrl = `${apiHost}${apiMyRecipes}`;
  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, bookmarks);
};
//second nav bar
const profileViewBtn = document.querySelector(".js-sc-nav-btn-1");
const editProfileBtn = document.querySelector(".js-sc-nav-btn-2");
const changePassBtn = document.querySelector(".js-sc-nav-btn-3");
const mngSubBtn = document.querySelector(".js-sc-nav-btn-4");
const logoutBtn = document.querySelector(".js-sc-nav-btn-5");

profileViewBtn.addEventListener("click", function () {
  activMainNavbtn(this);
  deactivMainNavbtn(editProfileBtn);
  deactivMainNavbtn(changePassBtn);
  deactivMainNavbtn(mngSubBtn);
  deactivMainNavbtn(logoutBtn);

  window.location.reload();
});
editProfileBtn.addEventListener("click", function () {
  activMainNavbtn(this);
  deactivMainNavbtn(profileViewBtn);
  deactivMainNavbtn(changePassBtn);
  deactivMainNavbtn(mngSubBtn);
  deactivMainNavbtn(logoutBtn);

  showDisplay(editProfileForm);
  //rest of the functions
});

changePassBtn.addEventListener("click", function () {
  activMainNavbtn(this);
  deactivMainNavbtn(profileViewBtn);
  deactivMainNavbtn(editProfileBtn);
  deactivMainNavbtn(mngSubBtn);
  deactivMainNavbtn(logoutBtn);

  //rest of the functions
});
mngSubBtn.addEventListener("click", function () {
  activMainNavbtn(this);
  deactivMainNavbtn(profileViewBtn);
  deactivMainNavbtn(editProfileBtn);
  deactivMainNavbtn(changePassBtn);
  deactivMainNavbtn(logoutBtn);

  //rest of the functions
  window.location.href = "/managesubscription";
});

logoutBtn.addEventListener("click", function () {
  activMainNavbtn(this);
  deactivMainNavbtn(profileViewBtn);
  deactivMainNavbtn(editProfileBtn);
  deactivMainNavbtn(changePassBtn);
  deactivMainNavbtn(mngSubBtn);

  //rest of the functions

  doLogout();
});

let doLogout = function () {
  fetch(`${apiHost}/api/logout`)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      window.location.href = "/home";
    })
    .catch((error) => console.log("error", error));
};

// User profile section update
const profAuthImg = document.getElementById("prof-auth-img");
const profAuthName = document.getElementById("prof-auth-name");
const profAuthBio = document.getElementById("prof-auth-bio");

const doProfileDisplay = function () {
  profAuthImg.src = userProfile.profile_image;
  profAuthName.textContent = userProfile.user_name;
  profAuthBio.textContent = userProfile.bio_info;
};

//section Navigation update
const myRecipeSecBtn = document.querySelector(".js-sec-nav-1");
const savedSecBtn = document.querySelector(".js-sec-nav-2");
const draftsSecBtn = document.querySelector(".js-sec-nav-3");

myRecipeSecBtn.addEventListener("click", function (e) {
  e.preventDefault();
  activSecNavbtn(this.querySelector(".nav-btn-text"));
  activSecNavbtn(this.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(savedSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(savedSecBtn.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(draftsSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(draftsSecBtn.querySelector(".nav-btn-highlight"));

  showDisplay(recipeDisSec);
  bookmarks = false;
  apiFetchUrl = `${apiHost}${apiMyRecipes}`;
  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, bookmarks);
});
savedSecBtn.addEventListener("click", function (e) {
  e.preventDefault();
  activSecNavbtn(this.querySelector(".nav-btn-text"));
  activSecNavbtn(this.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(myRecipeSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(myRecipeSecBtn.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(draftsSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(draftsSecBtn.querySelector(".nav-btn-highlight"));

  showDisplay(recipeDisSec);
  bookmarks = true;
  apiFetchUrl = `${apiHost}${apiSavedRecipes}`;
  fetchRecipeBySerch(apiFetchUrl, searchRCardBox, bookmarks);
});
draftsSecBtn.addEventListener("click", function (e) {
  e.preventDefault();
  activSecNavbtn(this.querySelector(".nav-btn-text"));
  activSecNavbtn(this.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(myRecipeSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(myRecipeSecBtn.querySelector(".nav-btn-highlight"));
  deactivSecNavbtn(savedSecBtn.querySelector(".nav-btn-text"));
  deactivSecNavbtn(savedSecBtn.querySelector(".nav-btn-highlight"));

  if (userPremium) {
    showDisplay(recipeDisSec);
    bookmarks = false;
    apiFetchUrl = `${apiHost}${apiDrafts}`;
    fetchRecipeBySerch(apiFetchUrl, searchRCardBox, bookmarks);
  } else {
    // alert("This feature is only avilable for premium users");
    searchRCardBox.innerHTML = "";
    let recipeErrorCardHtml = `<a href="/managesubscription" class="recipe-card-btn">
    <div class="recipe-card flex-column">
      
      <!-- ------------------- Recipe content ------------------- -->
      <div class="rc-content-container flex-column ">
      <div class="help-margin-bt-16"></div>
        <div class="rc-title-container">
          <p class="rc-title p-main-semibold">
            This is only for premium subscribers
          </p>
        </div>
        <div class="rc-author-details flex-row">
          
          <p class="rc-auth-name p-main-semibold">
            Click here to subscribe
          </p>
        </div>
        
      </div>
      <!-- ------------------- Recipe Indicator ------------------- -->
      <div class="rc-food-type-indicate rc-noRecipe"></div>
    </div>
    </a>`;
    searchRCardBox.insertAdjacentHTML("afterbegin", recipeErrorCardHtml);

    hideDisplay(loadMoreBtn);
    hideDisplay(loadMoreMsg);
  }
});

//Selecting sections
const recipeDisSec = document.getElementById("my-recipes");

const loadMoreMsg = document.querySelector(".js-load-more-msg");
const loadMoreBtn = document.querySelector(".js-load-more-btn");
const searchRCardBox = document.querySelector(".js-search-rc-box");

loadMoreBtn.addEventListener("click", function (e) {
  let apiFetUrl;
  // if (bookmarks) {
  //   apiFetUrl = `${apiSortFetchUrl}&pageNumber=${recipePageNumber + 1}`;
  // } else {
  //   apiFetUrl = `${apiFetchUrl}&pageNumber=${recipePageNumber + 1}`;
  // }
  apiFetUrl = `${apiFetchUrl}?pageNumber=${recipePageNumber + 1}`;
  fetchRecipeBySerch(apiFetUrl, searchRCardBox, bookmarks);
});

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

const fetchRecipeData = async function (apiUrl, contentBox, search, bookmark) {
  try {
    let { data: recipeSetData } = await fetch(apiUrl).then((res) => res.json());
    console.log(recipeSetData);
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
    if (bookmark) {
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
    } else {
      if (!search || recipePageNumber === 0) contentBox.innerHTML = "";
      recipesDataArr.forEach((recipeData) => {
        renderRecipeCard(recipeData, null, contentBox);
      });
    }
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
  let recipeCardHtml;
  if (userData) {
    recipeCardHtml = `<a href="${buildUrl(
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
            <span class="material-icons-outlined bookmark-icon icon-inactive"
              >bookmark_outline</span
            >
            <span
              class="material-icons bookmark-icon icon-filled "
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
  } else {
    recipeCardHtml = `<a href="${buildUrl(
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
  }

  contentBox.insertAdjacentHTML("beforeend", recipeCardHtml);
};

const fetchRecipeBySerch = function (apiFetUrl, containerBox, bookmark) {
  hideDisplay(loadMoreMsg);
  showDisplay(loadMoreBtn);

  fetchRecipeData(apiFetUrl, containerBox, true, bookmark);
};

const initialCall = function () {
  loginSessionCheck();
  onRelodNavUpdates();
};

initialCall();
