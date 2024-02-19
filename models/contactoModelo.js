const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  comentario: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    default: "Enviado",
    enum:["Enviado","Contactado","En Progreso"]
  },
});

//Export the model
module.exports = mongoose.model("Contacto", contactoSchema);
