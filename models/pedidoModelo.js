const { default: mongoose } = require("mongoose");

// Declare the Schema of the Mongo model
var pedidoSchema = new mongoose.Schema(
  {
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
        },
        cuenta: Number,
        color: String,
      },
    ],
    metodoPago: {},
    estadoOrden: {
      type: String,
      default: "No Procesado",
      enum: [
        "No Procesado",
        "pagoContraEntrega",
        "Procesando",
        "Enviando",
        "Cancelado",
        "Entregado",
      ],
    },
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
module.exports = mongoose.model("Pedido", pedidoSchema);
