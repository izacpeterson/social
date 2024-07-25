const sqlite3 = require("sqlite3").verbose();
// const database = new sqlite3.Database(":memory:");
const database = new sqlite3.Database("db.db");

database.serialize(() => {
  database.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT, 
    password TEXT
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
    database.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("success");
        }
      }
    );
  });
};

db.checkIfUserExists = (username) => {
  return new Promise((resolve, reject) => {
    database.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

db.checkPassword = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    database.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          reject("Database error");
        } else if (!row) {
          reject("User not found");
        } else if (hashedPassword === row.password) {
          resolve({ matches: true, user: row });
        } else {
          console.log(hashedPassword, row.password);
          resolve(false);
        }
      }
    );
  });
};

db.newPost = (username, content) => {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO posts (user, content, date) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)",
      [username, content, new Date()],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("success");
        }
      }
    );
  });
};

// Function to add Star Wars themed test data
db.addTestData = () => {
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Insert users
      const users = [
        ["luke_skywalker", "password123"],
        ["han_solo", "falconpass"],
        ["leia_organa", "alderaan123"],
        ["darth_vader", "darkside"],
        ["obi_wan", "hello_there"],
        ["yoda", "masterjedi"],
        ["chewbacca", "wookiepass"],
        ["r2d2", "beepboop"],
        ["c3po", "protocolpass"],
        ["palpatine", "unlimitedpower"],
      ];

      users.forEach((user) => {
        database.run(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          user
        );
      });

      // Insert posts
      const posts = [
        [1, "I'm here to rescue you!", "2024-07-25 10:00:00"],
        [2, "I've got a bad feeling about this.", "2024-07-25 11:00:00"],
        [
          3,
          "Help me, Obi-Wan Kenobi. You're my only hope.",
          "2024-07-25 12:00:00",
        ],
        [4, "I find your lack of faith disturbing.", "2024-07-25 13:00:00"],
        [5, "Hello there!", "2024-07-25 14:00:00"],
        [6, "Do or do not. There is no try.", "2024-07-25 15:00:00"],
        [7, "RRRAARRWHHGWWR", "2024-07-25 16:00:00"],
        [8, "Beep beep boop.", "2024-07-25 17:00:00"],
        [
          9,
          "I am fluent in over six million forms of communication.",
          "2024-07-25 18:00:00",
        ],
        [
          10,
          "Everything that has transpired has done so according to my design.",
          "2024-07-25 19:00:00",
        ],
        [1, "I will never join the dark side.", "2024-07-25 20:00:00"],
        [2, "Punch it, Chewie!", "2024-07-25 21:00:00"],
        [3, "I love you.", "2024-07-25 22:00:00"],
        [4, "No, I am your father.", "2024-07-25 23:00:00"],
        [5, "The Force will be with you. Always.", "2024-07-26 00:00:00"],
        [6, "Judge me by my size, do you?", "2024-07-26 01:00:00"],
        [7, "RRRAARRWHHGWWR!!!", "2024-07-26 02:00:00"],
        [8, "Beep boop beep.", "2024-07-26 03:00:00"],
        [9, "We're doomed.", "2024-07-26 04:00:00"],
        [
          10,
          "The dark side of the Force is a pathway to many abilities some consider to be unnatural.",
          "2024-07-26 05:00:00",
        ],
      ];

      posts.forEach((post) => {
        database.run(
          "INSERT INTO posts (user, content, date) VALUES (?, ?, ?)",
          post
        );
      });

      // Insert follow relationships
      const follows = [
        [1, 2], // Luke follows Han
        [1, 3], // Luke follows Leia
        [2, 3], // Han follows Leia
        [2, 7], // Han follows Chewbacca
        [3, 1], // Leia follows Luke
        [3, 2], // Leia follows Han
        [4, 5], // Vader follows Obi-Wan
        [4, 6], // Vader follows Yoda
        [5, 1], // Obi-Wan follows Luke
        [6, 1], // Yoda follows Luke
        [7, 2], // Chewbacca follows Han
        [8, 1], // R2-D2 follows Luke
        [9, 3], // C-3PO follows Leia
        [10, 4], // Palpatine follows Vader
      ];

      follows.forEach((follow) => {
        database.run(
          "INSERT INTO follow (user, follows) VALUES (?, ?)",
          follow
        );
      });

      // Insert likes
      const likes = [
        [1, 4], // Luke likes Vader's post
        [1, 10], // Luke likes Palpatine's post
        [2, 3], // Han likes Leia's post
        [2, 7], // Han likes Chewbacca's post
        [3, 1], // Leia likes Luke's post
        [3, 5], // Leia likes Obi-Wan's post
        [4, 2], // Vader likes Han's post
        [4, 6], // Vader likes Yoda's post
        [5, 1], // Obi-Wan likes Luke's post
        [6, 3], // Yoda likes Leia's post
        [7, 2], // Chewbacca likes Han's post
        [8, 9], // R2-D2 likes C-3PO's post
        [9, 8], // C-3PO likes R2-D2's post
        [10, 4], // Palpatine likes Vader's post
      ];

      likes.forEach((like) => {
        database.run("INSERT INTO likes (user, likes) VALUES (?, ?)", like);
      });

      resolve("Test data inserted successfully");
    });
  });
};

db.addTestData();

module.exports = db;
