const crypto = require("crypto");

let crypt = {};
crypt.hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

module.exports = crypt;
