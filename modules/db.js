const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database(":memory:");
// const database = new sqlite3.Database("db.db");

database.serialize(() => {
  database.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT, 
    password TEXT,
    birthday TEXT,
    bio TEXT,
    profile_pic TEXT,
    created_at TEXT,
    updated_at TEXT,
    last_login TEXT,
    theme TEXT
  )`);

  database.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER, 
    content TEXT, 
    date TEXT,
    FOREIGN KEY (user) REFERENCES users(id)
  )`);

  database.run(`CREATE TABLE IF NOT EXISTS follow (
    user INTEGER,
    follows INTEGER,
    PRIMARY KEY (user, follows),
    FOREIGN KEY (user) REFERENCES users(id),
    FOREIGN KEY (follows) REFERENCES users(id)
  )`);

  database.run(`CREATE TABLE IF NOT EXISTS likes (
    user INTEGER,
    likes INTEGER,
    PRIMARY KEY (user, likes),
    FOREIGN KEY (user) REFERENCES users(id),
    FOREIGN KEY (likes) REFERENCES posts(id)
  )`);
});

let db = {};

db.createUser = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    database.run("INSERT INTO users (username, password, created_at, theme) VALUES (?, ?, ?, ?)", [username, hashedPassword, new Date(), "light"], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
};

db.updateUser = (userId, updates) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    // Add the updated_at field with the current date and time
    fields.push("updated_at = ?");
    values.push(new Date());

    values.push(userId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    database.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "User updated successfully", changes: this.changes });
      }
    });
  });
};

db.checkIfUserExists = (username) => {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

db.checkPassword = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        reject("Database error");
      } else if (!row) {
        reject("User not found");
      } else if (hashedPassword === row.password) {
        resolve({ matches: true, user: row });
      } else {
        resolve(false);
      }
    });
  });
};

db.newPost = (user, content) => {
  return new Promise((resolve, reject) => {
    database.run("INSERT INTO posts (user, content, date) VALUES (?, ?, ?)", [user, content, new Date()], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
};

db.getUserInfo = (userID) => {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM users WHERE id = ?", [userID], (err, row) => {
      if (err) {
        reject("Database error");
      } else if (!row) {
        reject("User not found");
      } else {
        resolve({ matches: true, user: row });
      }
    });
  });
};

db.getUserFollowedPosts = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        posts.id, 
        posts.user, 
        users.username, 
        posts.content, 
        posts.date,
        COUNT(likes.likes) AS likeCount
      FROM posts
      INNER JOIN follow ON follow.follows = posts.user
      INNER JOIN users ON users.id = posts.user
      LEFT JOIN likes ON likes.likes = posts.id
      WHERE follow.user = ?
      GROUP BY posts.id, posts.user, users.username, posts.content, posts.date
      ORDER BY posts.date DESC
    `;

    database.all(query, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

db.followUser = (userId, followsId) => {
  return new Promise((resolve, reject) => {
    database.run("INSERT INTO follow (user, follows) VALUES (?, ?)", [userId, followsId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
};

db.likePost = (userId, postId) => {
  return new Promise((resolve, reject) => {
    database.run("INSERT INTO likes (user, likes) VALUES (?, ?)", [userId, postId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
};

db.getPostLikes = (postId) => {
  return new Promise((resolve, reject) => {
    database.get("SELECT COUNT(*) as likeCount FROM likes WHERE likes = ?", [postId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.likeCount);
      }
    });
  });
};

db.getUserPosts = (userId) => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM posts WHERE user = ? ORDER BY date DESC", [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Function to add test data
db.addTestData = () => {
  db.createUser("izac", "izac");
  db.updateUser(1, { theme: "business" });
  db.newPost(1, "Hello, World!");
  db.followUser(1, 1);
  db.likePost(1, 1);
  db.likePost(2, 1);

  db.createUser("rachel", "rachel");
  db.newPost(2, "hi!");
  db.followUser(1, 2);
  db.likePost(1, 2);
};

db.addTestData();

module.exports = db;
