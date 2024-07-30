const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

const port = 8080;

// const indexRoutes = require("./routes/index.js");
const userRoutes = require("./routes/users.js");
const authRotes = require("./routes/auth.js");
const postRoutes = require("./routes/posts.js");

//Set signed in user, for testing
app.use((req, res, next) => {
  req.session.user = 1;
  next();
});

// app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRotes);
app.use("/posts", postRoutes);

app.listen(port, () => {
  console.log("App Listening");
});
