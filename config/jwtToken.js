const jwt = require("jsonwebtoken");

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CLS, { expiresIn: "1d" });
};

module.exports = { generarToken };
