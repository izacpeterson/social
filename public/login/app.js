async function registerUser(username, password) {
  const url = "/auth/login";
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
  reslutJson;

  if (reslutJson.success) {
    window.location.href = "/";
  } else {
    alert("ERROR: " + reslutJson.reason);
  }
}

document.querySelector("#registerButton").addEventListener("click", () => {
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;

  if (username.length == 0 || password.length == 0) {
    alert("Invalid Username or Password");
  } else {
    registerUser(username, password);
  }
});
