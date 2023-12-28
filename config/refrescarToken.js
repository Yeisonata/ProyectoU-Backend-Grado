const jwt = require("jsonwebtoken");

const actualizarRToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CLS, { expiresIn: "3d" });
};

module.exports = { actualizarRToken };
