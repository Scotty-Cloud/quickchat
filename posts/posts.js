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

//function to sort posts onchange of dropdown select
async function onDropdownSort() {
  displayPosts.innerHTML = "";
  let unlikeID = "";
  try {
    const response = await fetch(
      `${apiBaseURL}/api/posts?limit=1000&offset=0`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + bearerToken.token,
        },
      }
    );
    const data = await response.json();
    let newData = Object.values(data);
    console.log(newData); //test
    if (dropdownSortPosts.value == "new") {
      newData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dropdownSortPosts.value == "popular") {
      newData.sort((a, b) => b.likes.length - a.likes.length);
    } else if (dropdownSortPosts.value == "username") {
      newData.sort((a, b) =>
        b.username.toLowerCase() > a.username.toLowerCase() ? -1 : 1
      );
    }
    newData.forEach((post) => {
      let newDate = new Date(post.createdAt); // for date formatting
      // check if own post to display delete button
      let isPostOwner = false;
      if (bearerToken.username == post.username) {
        isPostOwner = true;
      }
      //check if liked or not
      let isLiked = false;
      post.likes.forEach((like) => {
        if (like.username == bearerToken.username) {
          isLiked = true;
          unlikeID = like._id;
        }
      });
      //call function to display each post
      displayAllPosts(
        post.username,
        newDate.toLocaleString(),
        post.text,
        post.likes.length,
        isPostOwner,
        post._id,
        isLiked,
        unlikeID
      );
    });
  } catch (error) {
    console.log(error);
  }
  console.log(allBtnDelete.length); //remove later
  console.log(allBtnLike.length); //remove later

  // like a post when clicked
  for (let i = 0; i < allBtnLike.length; i++) {
    allBtnLike[i].onclick = () => {
      if (allBtnLike[i].dataset.value == "Unliked") {
        allBtnLike[i].className += " clicked";
        likePost(allBtnLike[i].id);
      } else if (allBtnLike[i].dataset.value == "Liked") {
        allBtnLike[i].classList.remove("clicked");
        unlikePost(allBtnLike[i].id);
      }
    };
  }

  // delete post when clicked
  for (let i = 0; i < allBtnDelete.length; i++) {
    allBtnDelete[i].onclick = () => {
      let text = "Are you sure you want to DELETE your post?";
      if (confirm(text) == true) {
        deletePost(allBtnDelete[i].id);
        alert("Post deleted succesfully.");
        location.reload();
      }
    };
  }
}

