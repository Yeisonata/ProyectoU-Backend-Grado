const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    numeroVisitas: {
      type: Number,
      default: 0,
    },
    esMeGustas: {
      type: Boolean,
      default: false,
    },
    esNoMeGustas: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    
    autor: {
      type: String,
      default: "Admin",
    },
    imagenes:[],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
