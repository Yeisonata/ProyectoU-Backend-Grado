const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productoSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
    },
    marca: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    imagenes: [],
    vendido: {
      type: Number,
      default: 0,
    },
    color:[],
    etiquetas:[],
    calificaciones: [
      {
        estrella: Number,
        comentario: String,
        publicadorpor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      },
    ],
    totalCalificacion: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Producto", productoSchema);
