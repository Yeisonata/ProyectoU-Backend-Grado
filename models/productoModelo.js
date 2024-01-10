const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  ficha: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
  marca: {
    type: String,
    enum: ["Apple", "Samsung", "Xiaomi"],
  },
  cantidad: Number,
  imagenes: {
    type: Array,
  },
  vendido: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    enum: ["Negro", "Rojo", "Cafe"],
  },
  calificaciones: [
    {
      estrella: Number,
      publicadorpor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    },
  ],
},{timestamps:true});

//Export the model
module.exports = mongoose.model("Producto", productoSchema);
