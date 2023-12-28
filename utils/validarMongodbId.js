//Para validar el id desde mongodb
const mongoose = require("mongoose");
const validarMongoDbId = (id) => {
  const esValido = mongoose.Types.ObjectId.isValid(id)
  if (!esValido)
    throw new Error(
      "Este id no es valido o no se encuentra en la bases de datos"
    );
};
module.exports = validarMongoDbId;
