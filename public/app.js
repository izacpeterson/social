async function registerUser(username, password) {
  const url = "/auth/register";
  const data = {
    username: username,
    password: password,
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
    window.location.href = "/";
  } else {
    alert("ERROR: " + reslutJson.reason);
  }
}

async function loginUser() {
  const url = "/auth/login";
  const data = {
    username: "izac",
    password: "password",
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
  reslutJson;
}

async function getUser() {
  let result = await fetch("/auth/currentUser");
  let reslutJson = await result.json();

  if (reslutJson.success) {
    window.location.href = "/app";
  }
}

async function newPost() {
  const url = "/posts/new";
  const data = {
    postContent: "Hello, World!",
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
}

document.querySelector("#registerButton").addEventListener("click", () => {
  registerUser(document.querySelector("#registerUsername").value, document.querySelector("#registerPassword").value);
});

getUser();
