const { default: mongoose } = require("mongoose");

//Para conectar la base de datos
const dbConexion = () => {
  try {
    const con = mongoose.connect(process.env.MONGODB_URL)
    console.log("Base de datos conectada");
  } catch (error) {
    console.log("Error en la base Datos");
  }
};
module.exports = dbConexion;
