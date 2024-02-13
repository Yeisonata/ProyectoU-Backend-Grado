const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cuponSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiracion: {
    type: Date,
    required: true,
  },
  descuento: {
    type: Number,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Cupon", cuponSchema);
