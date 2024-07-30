// let tabsElement = document.querySelector("#tabs");
// let followingTabElement = document.querySelector("#followingTab");
// let trendingTabElement = document.querySelector("#trendingTab");
// let activeTab = "following";

// tabsElement.addEventListener("click", (e) => {
//   followingTabElement.classList.toggle("tab-active");
//   trendingTabElement.classList.toggle("tab-active");
//   if (activeTab == "following") {
//     activeTab = "trending";
//   } else {
//     activeTab = "following";
//   }
// });

async function getFollowedPosts() {
  let response = await fetch("/posts/getFollowPosts");
  let result = await response.json();

  result;
  result.posts.forEach((post) => {
    renderPost(post);
  });
}

function renderPost(postData) {
  const post = `
    <div class="bg-base-200 m-4 w-5/6 lg:w-1/3 shadow-lg rounded-md">
    <div class="flex justify-between w-full bg-primary text-white p-2 rounded-t-md">
        <span class="underline">${postData.username}</span><span>${new Date(postData.date * 1).toLocaleString()}</span>
    </div>
    <p class="p-4">${postData.content}</p>
    <span class="p-4">Likes: ${postData.likeCount}</span>
    </div>
    `;

  document.body.innerHTML += post;
}

async function getCurrentUser() {
  let resonse = await fetch("/auth/currentUser");
  let user = await resonse.json();
  document.documentElement.setAttribute("data-theme", user.user.user.theme);
}

async function newPost(postContent) {
  let postText = document.getElementById("newPostText").value;

  const url = "/posts/new";
  const data = {
    postContent: postText,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let result = await fetch(url, options);
  let reslutJson = await result.json();
  if (reslutJson.success) {
    window.location.reload();
  }
}

document.getElementById("newPostButton").addEventListener("click", () => {
  let postText = document.getElementById("newPostText").value;

  newPost(postText);
});

getFollowedPosts();
getCurrentUser();

console.log("hasdfi");
