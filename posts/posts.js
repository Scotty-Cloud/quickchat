/* Posts Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");
const dropdownSortPosts = document.querySelector("#dropdownSortPosts");
const newPost = document.querySelector("#textBoxPost");
const allBtnDelete = document.getElementsByClassName("btnDelete");
const allBtnLike = document.getElementsByClassName("btnLike");
const btnSubmit = document.querySelector("#btnSubmit");
const btnScrollToTop = document.querySelector(".btnScrollToTop");

// when page loads
window.onload = () => {
  dropdownSortPosts.value = "new";
  onDropdownSort();
  dropdownSortPosts.onchange = onDropdownSort;
};

const wait = (delay = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const setVisible = (elementOrSelector, visible) =>
  ((typeof elementOrSelector === "string"
    ? document.querySelector(elementOrSelector)
    : elementOrSelector
  ).style.display = visible ? "block" : "none");

setVisible(".page", false);
setVisible("#loading", true);

document.addEventListener("DOMContentLoaded", () =>
  wait(1000).then(() => {
    setVisible(".page", true);
    setVisible("#loading", false);
  })
);

// Show or hide button that scrolls to the top of page
window.onscroll = () => {
  scrollFunction();
};

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnScrollToTop.style.display = "block";
  } else {
    btnScrollToTop.style.display = "none";
  }
};

// logout button
btnLogOut.onclick = () => {
  logout();
};

// when button is clicked, create a post using value from form
btnSubmit.onclick = function(event) {
  event.preventDefault();
  createPost(newPost.value);
};

// function for creating a new post
function createPost(_content) {
  fetch(`${apiBaseURL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + bearerToken.token,
    },
    body: JSON.stringify({
      text: _content,
    }),
    redirect: "follow",
  })
    .then(response => response.json())
    .then(data => {
      console.log(data); // test
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      location.reload();
    });
}

