async function registerUser() {
  const url = "/auth/register";
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
  console.log(reslutJson);
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
  console.log(reslutJson);
}

async function getUser() {
  let result = await fetch("/auth/currentUser");
  let reslutJson = await result.json();
  console.log(reslutJson);
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
  console.log(reslutJson);
}
