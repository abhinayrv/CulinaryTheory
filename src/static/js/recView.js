`use strict`;

const apiHost = "";

function getRecipeId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("recipe_id");
}
const recipe_id = getRecipeId();
console.log(recipe_id);

async function viewRecipe(recipe_id) {
  try {
    var response = await fetch("/api/recipe/" + recipe_id);
    var rjson = await response.json();
    if (response.ok) {
      console.log(rjson);
      recipeJson = rjson.data;
      renderRecipePage(rjson.data);

      uiUpdate();
      return rjson;
    } else {
      //some error or recipe not found.
      throw Error(rjson.message);
    }
  } catch (error) {
    console.log(error);
  }
}

// //////////////////////////////////////////////////////////////////
//pop-up & over-lays
//error pop-up
const errorPopup = document.getElementById("error-popup");
errorPopup.addEventListener("click", function (e) {
  if (e.target.classList.contains("err-cls-btn")) hideDisplay(errorPopup);
});
const displayError = function (errMessage, isErr = true) {
  if (!isErr) {
    errorPopup.style.backgroundColor = "#16a085";
  } else {
    errorPopup.style.backgroundColor = "#ed3949";
  }

  showDisplay(errorPopup);
  errorPopup.firstElementChild.textContent = errMessage;
  setTimeout(() => hideDisplay(errorPopup), 5000);
  return false;
};

////////////////////

let recipeJson;

let user_liked;
let likes;
let dislikes;
let userBookmarked;

const recipeTitle = document.querySelector(".rv-title");
const recipePostDate = document.querySelector(".rv-post-date");
const recipeImg = document.querySelector(".rv-img");
const rvlikeCount = document.querySelector(".rv-like-count");
const rvDislikeCount = document.querySelector(".rv-dislike-count");
const rvPreptime = document.querySelector(".rv-preptime");
const rvCuisine = document.querySelector(".rv-cuisine");
const rvPreference = document.querySelector(".rv-preference");
const rvDescription = document.querySelector(".rv-descriptions");
const rvIngCon = document.querySelector(".rv-ingredient-container");
const rvStepCon = document.querySelector(".rv-directions-container");
const rvTags = document.querySelector(".rv-tag");
const likeBtn = document.querySelector(".rv-likes");
const likeIcon = likeBtn.querySelector(".rv-icon-btn");
const dislikeBtn = document.querySelector(".rv-dislikes");
const dislikeIcon = dislikeBtn.querySelector(".rv-icon-btn");
const bookmarkBtn = document.querySelector(".rv-bookmark");
const bookmarkIcon = bookmarkBtn.querySelector(".rv-icon-btn");
const deleteBtn = document.querySelector(".rv-delete");
const editBtn = document.querySelector(".rv-edit");
const viewBtn = document.querySelector(".rv-view");
const viewIcon = viewBtn.querySelector(".rv-icon-btn");
const recipeAuthor = document.getElementById("author-name");
const loginBtnComments = document.querySelector(".login-btn-comments");
const commentsSection = document.querySelector(".comments-section");
const commentsContainer = document.querySelector(".comments-container");
const addCommentBtn = document.querySelector(".add-comment");
const commentInputBox = document.querySelector(".comment-box");
const reportResonType = document.getElementById("report-reson-type");
const reportBtn = document.querySelector(".rv-report");
const reportResPopup = document.querySelector(".for-report-recipe");
const reportPopClose = document.querySelector(".report-pop-close");
const reportSubmitBtn = document.getElementById("report-submit-btn");

addCommentBtn.addEventListener("click", function () {
  let commentText = commentInputBox.value;
  addComment(recipe_id, commentText);
});

reportBtn.addEventListener("click", function () {
  reportResPopup.classList.remove("display-hide");
});
reportPopClose.addEventListener("click", function () {
  reportResPopup.classList.add("display-hide");
});

reportSubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let reason = reportResonType.value;
  reportResonType.value = "";
  report(recipe_id, reason);
  reportResPopup.classList.add("display-hide");
});

async function report(recipe_id, reason) {
  try {
    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipe_id, reason: reason }),
    };
    var response = await fetch("/api/report", options);

    var rjson = await response.json();
    if (response.ok) {
      displayError(rjson.message, false);
    } else {
      throw Error(rjson.message);
    }
  } catch (error) {
    displayError(error.message);
  }
}

async function addComment(recipe_id, comment) {
  try {
    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipe_id, comment_text: comment }),
    };
    var response = await fetch("/api/comment", options);
    var rjson = await response.json();
    if (response.ok) {
      //change dom elements as required.
      console.log("Comment added successfully");
      displayError(rjson.message, false);
      return false;
    } else {
      throw Error(rjson.message);
    }
  } catch (error) {
    displayError(error.message);
    console.log(error);
  }
}

function renderComments(data) {
  let innerHTML = `<div class="comment-row">
  <div class="comment-details flex-row help-margin-bt-8">
    <div
      class="flex-row"
      style="gap: 0.8rem; align-items: center"
    >
      <div class="co-user-img-container">
        <img src="" alt="user photo" class="user-img" />
      </div>
      <p class="com-user-name h-5-main-semibold">The Culinary Theory</p>
    </div>
    <p class="p-help-semibold comment-time">${new Date(
      data.createdAt
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      day: "numeric",
    })}</p>
  </div>
  <p class="p-main-reg comment-txt">
    ${data.comment_text}
  </p>
</div>`;

  commentsContainer.insertAdjacentHTML("afterbegin", innerHTML);
}

const makingPrivate = function () {
  make_private(recipeJson);
}

viewBtn.addEventListener("click", makingPrivate);

deleteBtn.addEventListener("click", function () {
  delete_recipe(recipe_id);
});

function uiUpdate() {
  console.log(recipeJson.self_recipe);
  if (recipeJson.self_recipe) {
    deleteBtn.classList.remove("display-hide");
    if (userProfile.is_premium) {
      viewBtn.classList.remove("display-hide");
      viewIcon.classList.remove("rv-icon-btn-disabled");
      viewIcon.classList.add("rv-icon-btn");
      viewBtn.addEventListener('click',makingPrivate)
    } else {
      viewIcon.classList.add("rv-icon-btn-disabled");
      viewIcon.classList.remove("rv-icon-btn");
      viewBtn.removeEventListener('click',makingPrivate);
    }
  } else {
    deleteBtn.classList.add("display-hide");
    viewBtn.classList.add("display-hide");
  }
}
function commentsUi() {
  if (userLoggedIn) {
    commentsSection.classList.remove("display-hide");
    loginBtnComments.classList.add("display-hide");
  } else {
    commentsSection.classList.add("display-hide");
    loginBtnComments.classList.remove("display-hide");
  }
}

bookmarkBtn.addEventListener("click", function () {
  execBookmark();
});

likeBtn.addEventListener("click", function (e) {
  execLike(true);
  likes++;
  if (dislikes !== 0) dislikes--;
  rvDislikeCount.textContent = dislikes;
  rvlikeCount.textContent = likes;
});

dislikeBtn.addEventListener("click", function () {
  execLike(false);
  dislikes++;
  if (likes !== 0) likes--;
  rvDislikeCount.textContent = dislikes;
  rvlikeCount.textContent = likes;
});

async function getComments(recipe_id, page_number) {
  try {
    var response = await fetch(
      `/api/comments/${recipe_id}?pageNumber=${page_number}`
    );
    var rjson = await response.json();
    if (response.ok) {
      // to do - add comments here
      // var xomments(rjson.data.data);
      commentsContainer.innerHTML = "";
      rjson.data.data.forEach((x) => renderComments(x));
      return rjson;
    } else {
      // to do - no comments found or some error in fetching comments.
      throw Error(rjson.message);
    }
  } catch (error) {
    console.log(error);
  }
}

getComments(recipe_id, 0);
const renderRecipePage = function (data) {
  recipeTitle.innerHTML = "";
  recipeTitle.insertAdjacentHTML("afterbegin", `${data.title.toUpperCase()}`);
  recipePostDate.innerHTML = "";
  recipePostDate.insertAdjacentHTML(
    "afterbegin",
    `posted on ${new Date(data.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      day: "numeric",
    })}`
  );
  recipeImg.src = data.image_url;
  rvlikeCount.textContent = likes = data.likes;
  rvDislikeCount.textContent = dislikes = data.dislikes;
  rvPreptime.textContent = data.prep_time;
  rvCuisine.textContent = data.cuisine;
  rvPreference.textContent = data.dietary_preferences;
  if (recipeJson.self_recipe) {
    recipeAuthor.textContent = userProfile.user_name;
  }
  rvDescription.innerHTML = "";
  rvDescription.insertAdjacentHTML("afterbegin", `${data.description}`);
  if (!data.is_public) viewIcon.textContent = "visibility_off";

  rvIngCon.innerHTML = "";
  data.ingredients.map((x) => {
    let innerHtmlr = `<div class="rv-ing-row flex-row">
    <p class="ing-name h-5-main-semibold">${x.ingredient}</p>
    <p class="ing-qua h-5-main-semibold">${x.quantity}</p>
  </div>`;
    rvIngCon.insertAdjacentHTML("beforeend", innerHtmlr);
  });
  rvStepCon.innerHTML = "";
  data.steps.map((x) => {
    let innerHtmlr = `<div class="rv-step-row help-margin-bt-8">
    <p class="step-num h-5-main-bold">Step ${x.step_no}</p>
    <p class="step-cont p-main-reg">
      ${x.step}
    </p>
  </div>`;
    rvStepCon.insertAdjacentHTML("beforeend", innerHtmlr);
  });
  rvTags.textContent = data.tags.join(", ");
};

async function execBookmark() {
  await bookmark_recipe(userBookmarked, recipe_id);
  check_bookmark();
}

async function make_private(recipe_json) {
  try {
    delete recipe_json["user_id"];
    delete recipe_json["likes"];
    delete recipe_json["dislikes"];
    delete recipe_json["self_recipe"];
    delete recipe_json["adminDelete"];
    delete recipe_json["createdAt"];
    delete recipe_json["updatedAt"];
    delete recipe_json["__v"];
    recipe_json["is_public"] = !recipe_json["is_public"];
    console.log(recipe_json);

    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe_json),
    };
    var response = await fetch("/api/recipe/edit", options);

    var rjson = await response.json();
    if (response.ok) {
      window.location.reload();
      return false;
    } else {
      throw Error(rjson.message);
    }
  } catch (error) {
    console.log(error);
  }
}

async function check_bookmark() {
  let res = await is_bookmarked(recipe_id);
  if (res) {
    userBookmarked = true;
    bookmarkIcon.textContent = "bookmark";
  } else {
    userBookmarked = false;
    bookmarkIcon.textContent = "bookmark_outline";
  }
}

check_bookmark();
async function is_bookmarked(recipe_id) {
  try {
    var response = await fetch(`/api/isbookmarked/${recipe_id}`);
    var rjson = await response.json();

    if (response.ok) {
      console.log(rjson);
      return rjson.data.bookmarked;
    } else {
      throw Error(rjson.message);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function delete_recipe(recipe_id) {
  try {
    var options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipe_id }),
    };

    var response = await fetch("/api/recipe/delete", options);
    var rjson = await response.json();

    if (response.ok) {
      console.log("Recipe deleted sucessfully");
      window.location.href = "/home";
      return false;
    } else {
      throw Error(rjson.message);
    }
  } catch (err) {
    // pop up error
    console.log(err.message);
  }
}

async function bookmark_recipe(prev_bookmarked, recipe_id) {
  try {
    if (prev_bookmarked) {
      var options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_id: recipe_id }),
      };

      var response = await fetch("/api/bookmark/delete", options);
      var rjson = await response.json();

      if (response.ok) {
        console.log("Recipe bookmark removed sucessfully");
        return false;
      } else {
        throw Error(rjson.message);
      }
    } else {
      var options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_id: recipe_id }),
      };

      var response = await fetch("/api/bookmark", options);
      var rjson = await response.json();

      if (response.ok) {
        console.log("Recipe bookmarked sucessfully");
        return false;
      } else {
        throw Error(rjson.message);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function is_liked(recipe_id) {
  try {
    var response = await fetch(`/api/isliked/${recipe_id}`);
    var rjson = await response.json();

    if (response.ok) {
      console.log(rjson);
      return rjson.data;
    } else {
      throw Error(rjson.message);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function execLike(likeVal) {
  likeIcon.classList.add("material-icons-outlined");
  likeIcon.classList.remove("material-icons");
  dislikeIcon.classList.add("material-icons-outlined");
  dislikeIcon.classList.remove("material-icons");
  console.log(user_liked, likeVal, recipe_id);
  await like_dislike(user_liked, likeVal, recipe_id);
  checkLike();
}
const checkLike = async function () {
  let res = await is_liked(recipe_id);
  console.log(res);
  if (res.liked) {
    user_liked = true;
    likeIcon.classList.remove("material-icons-outlined");
    likeIcon.classList.add("material-icons");
  } else if (res.disliked) {
    user_liked = true;
    dislikeIcon.classList.remove("material-icons-outlined");
    dislikeIcon.classList.add("material-icons");
  } else {
    user_liked = false;
  }
};

checkLike();
async function like_dislike(prev_liked, is_like, recipe_id) {
  try {
    if (prev_liked) {
      console.log("here");
      await remove_like(recipe_id);
      await add_like(is_like, recipe_id);
    } else {
      console.log("here1");
      await add_like(is_like, recipe_id);
    }
  } catch (err) {
    // pop up code
    console.log(err.message);
  }
}

async function remove_like(recipe_id) {
  console.log("removing like");
  var options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe_id: recipe_id }),
  };
  var response = await fetch("/api/like/delete", options);
  var rjson = await response.json();

  if (response.ok) {
    console.log("Removed like/dislike successfully");
    return true;
  } else {
    throw Error(rjson.message);
  }
}

async function add_like(is_like, recipe_id) {
  console.log("here");
  console.log(recipe_id);
  var options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe_id: recipe_id, is_liked: is_like }),
  };
  var response = await fetch("/api/like", options);
  var rjson = await response.json();

  if (response.ok) {
    console.log("Added like/dislike sucessfully");
    return false;
  } else {
    throw Error(rjson.message);
  }
}

//login related varaibles
let userProfile;
let userLoggedIn = false;

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

// homeBtn.addEventListener("click", function (e) {
//   window.location.reload();
// });

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
    commentsUi();
    viewRecipe(recipe_id);
  } catch (error) {
    console.log(error.message);
  }
};
loginSessionCheck();
const updateMainNav = function () {
  deactivMainNavbtn(homeBtn);
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
