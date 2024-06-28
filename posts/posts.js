"use strict";

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

btnLogOut.onclick = () => {
  logout();
};

btnSubmit.onclick = function (event) {
  event.preventDefault();
  createPost(newPost.value);
};

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
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // test
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      location.reload();
    });
}

async function onDropdownSort() {
  displayPosts.innerHTML = "";
  let unlikeID = "";
  try {
    const response = await fetch(
      `${apiBaseURL}/api/posts?limit=50&offset=0`,
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
      let newDate = new Date(post.createdAt);
 
      let isPostOwner = false;
      if (bearerToken.username == post.username) {
        isPostOwner = true;
      }

      let isLiked = false;
      post.likes.forEach((like) => {
        if (like.username == bearerToken.username) {
          isLiked = true;
          unlikeID = like._id;
        }
      });
  
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

  for (const btn of allBtnLike) {
    btn.onclick = () => {
      if (btn.dataset.value == "Unliked") {
        btn.className += " clicked";
        likePost(btn.id);
      } else if (btn.dataset.value == "Liked") {
        btn.classList.remove("clicked");
        unlikePost(btn.id);
      }
    };
  }

  for (const btn of allBtnDelete) {
    btn.onclick = () => {
      let text = "Are you sure you want to DELETE your post?";
      if (confirm(text) == true) {
        deletePost(btn.id);
        alert("Post deleted succesfully.");
        location.reload();
      }
    };
  }
}

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayAllPosts(
  _username,
  _date,
  _text,
  _numLikes,
  _ownPost,
  _valueID,
  _isLiked,
  _unlikeID
) {
  let ownPost = ""; 
  if (_ownPost) {
    ownPost = `<button class="btnDelete" id="${_valueID}"><i class="fas fa-trash trash" style="color: #df4e4e;"></i></button>`;
  } else {
    ownPost = "";
  }

  let isLiked = "";
  if (_isLiked) {
    isLiked = `<div class="post-activity-link btnLike clicked" id="${_unlikeID}" data-value="Liked">
                    <i class="fas fa-heart"></i><span>Unlike</span>
                  </div>`;
  } else {
    isLiked = `<div class="post-activity-link btnLike" id="${_valueID}" data-value="Unliked">
                    <i class="fas fa-heart"></i><span>Like</span>
                  </div>`;
  }

  const randomNumber = Math.floor(Math.random() * 150);
  const randomRepost = Math.floor(Math.random() * 40);

  displayPosts.innerHTML += `
      <div class="post">
                
                <div class="post-author">
                  
                    <img src="../images/defaultUser.png" alt="Default user">
                    <div>
                        <h1>${_username}</h1>
                        <small>${_date} </small>
                    </div>
                </div>
                ${ownPost}
                <p>
                ${_text}
                </p>

                <div class="post-stats">
                    <div>
                        <span class="liked-users"> ${_numLikes} likes </span>
                    </div>
                    <div>
                        <span> ${randomNumber} comments || ${randomRepost} Repost </span>
                    </div>
                </div>

                <div class="post-activity">
                    <div>
                        <img src="../images/defaultUser.png" alt="" class="post-activity-user-icon">
                    </div>
                    ${isLiked}    
                    <div class="post-activity-link">
                        <i class="fas fa-comment"></i>
                        <span>Comment</span>
                    </div>
                    <div class="post-activity-link">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </div>
                    <div class="post-activity-link">
                        <i class="fas fa-paper-plane"></i>
                        <span>Send</span>
                    </div>

                </div>
            </div>
      `;
}


async function likePost(_postID) {
  try {
    const response = await fetch(`${apiBaseURL}/api/likes`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + bearerToken.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: _postID,
      }),
    });
    const data = await response.json();
    console.log(data);
    console.log("Post liked."); //test
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function unlikePost(_postID) {
  try {
    const response = await fetch(`${apiBaseURL}/api/likes/${_postID}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + bearerToken.token,
      },
    });
    const data = await response.json();
    console.log(data); //test
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function deletePost(_postID) {
  try {
    const response = await fetch(`${apiBaseURL}/api/posts/${_postID}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + bearerToken.token,
      },
    });
    const data = await response.json();
    console.log(data); //test
    console.log("Post deleted."); //test
  } catch (error) {
    console.log(error);
  }
}

const settingsMenu = document.querySelector(".settings-menu");
const darkBtn = document.getElementById("dark-btn");

function settingsMenuToggle() {
  settingsMenu.classList.toggle("settings-menu-height");
}

darkBtn.onclick = function () {
  darkBtn.classList.toggle("dark-btn-on");
  document.body.classList.toggle("dark-theme");

  if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};


if (localStorage.getItem("theme") == "light") {
  darkBtn.classList.remove("dark-btn-on");
  document.body.classList.remove("dark-theme");
} else if (localStorage.getItem("theme") == "dark") {
  darkBtn.classList.add("dark-btn-on");
  document.body.classList.add("dark-theme");
} else {
  localStorage.setItem("theme", "light");
}