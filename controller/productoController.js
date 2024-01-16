// Importar el modelo de productos
const Producto = require("../models/productoModelo");

// Importar la utilidad para manejar funciones asíncronas en Express
const asyncHandler = require("express-async-handler");

// Controlador para manejar la creación de un nuevo producto
const crearProducto = asyncHandler(async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body)
     // Responder con un mensaje JSON indicando que es la ruta de publicación de productos
  res.json(nuevoProducto);
  } catch (error) {
    throw new Error(error)
  }
 
});

// Controlador para obtener un producto por su ID
const obtenerProducto = asyncHandler(async (req, res) => {
  // Extraer el ID del parámetro de la solicitud
  const { id } = req.params;

  try {
    // Buscar el producto en la base de datos utilizando el ID
    const encontrarProducto = await Producto.findById(id);

    // Responder con el producto encontrado en formato JSON
    res.json(encontrarProducto);
  } catch (error) {
    // Manejar errores y lanzar una excepción con el mensaje de error
    throw new Error(error);
  }
});

// Exportar el controlador para su uso en las rutas
module.exports = { crearProducto ,obtenerProducto };
