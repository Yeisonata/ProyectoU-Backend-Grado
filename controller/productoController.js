// Importar el modelo de productos
const Productos = require("../models/productoModelo");

// Importar la utilidad para manejar funciones asíncronas en Express
const asyncHandler = require("express-async-handler");

// Controlador para manejar la creación de un nuevo producto
const crearProducto = asyncHandler(async (req, res) => {
  // Responder con un mensaje JSON indicando que es la ruta de publicación de productos
  res.json({
    message: "Hola, es la ruta de publicación del producto."
  });
});

// Exportar el controlador para su uso en las rutas
module.exports = { crearProducto };
