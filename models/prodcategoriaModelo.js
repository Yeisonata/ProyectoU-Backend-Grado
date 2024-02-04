const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var prodcategoriaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Pcategoria", prodcategoriaSchema);
