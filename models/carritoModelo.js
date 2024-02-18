const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var carritoSchema = new mongoose.Schema(
  {
    productos: [
      {
        productos: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        cuenta: Number,
        color: String,
        precio:Number,
      },
    ],
   carritoTotal:Number,
  totalDespuesDescuento:Number,
    ordenPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Carrito", carritoSchema);
