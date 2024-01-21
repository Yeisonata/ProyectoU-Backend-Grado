// Importar el modelo de productos
const Producto = require("../models/productoModelo");

// Importar la utilidad para manejar funciones asíncronas en Express
const asyncHandler = require("express-async-handler");

const slugify = require("slugify");

// Controlador para manejar la creación de un nuevo producto
const crearProducto = asyncHandler(async (req, res) => {
  try {
    if (req.body.titulo) {
      req.body.ficha = slugify(req.body.titulo);
    }
    const nuevoProducto = await Producto.create(req.body);
    // Responder con un mensaje JSON indicando que es la ruta de publicación de productos
    res.json(nuevoProducto);
  } catch (error) {
    throw new Error(error);
  }
});

// Define la función asincrónica actualizarProducto utilizando asyncHandler
const actualizarProducto = asyncHandler(async (req, res) => {
  // Desestructura el objeto req.params para obtener el valor específico 'id'
  const { id } = req.params;

  try {
    // Verifica si req.body.titulo existe y crea el campo 'ficha' utilizando slugify
    if (req.body.titulo) {
      req.body.ficha = slugify(req.body.titulo);
    }

    // Utiliza findOneAndUpdate para actualizar el producto por su '_id' en la base de datos
    const actualizarProducto = await Producto.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    // Responde con el producto actualizado en formato JSON
    res.json(actualizarProducto);
  } catch (error) {
    // Captura y lanza cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});


// Define la función asincrónica eliminarProducto utilizando asyncHandler
const eliminarProducto = asyncHandler(async (req, res) => {
  // Desestructura el objeto req.params para obtener el valor específico 'id'
  const { id } = req.params;

  try {
    // Utiliza findOneAndDelete para eliminar el producto por su '_id' en la base de datos
    const productoEliminado = await Producto.findOneAndDelete( id );

    // Responde con el producto eliminado en formato JSON
    res.json(productoEliminado);
  } catch (error) {
    // Captura y lanza cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});

// Exporta la función para su uso en las rutas
module.exports = { eliminarProducto };


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
// Define la función asincrónica getAllProductos utilizando asyncHandler
const getAllProductos = asyncHandler(async (req, res) => {
  try {
    // Utiliza el modelo de productos para buscar todos los productos en la base de datos
    const todosLosProductos = await Producto.find();

    // Responde con la lista de todos los productos en formato JSON
    res.json(todosLosProductos);
  } catch (error) {
    // Captura y lanza cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});

// Exportar el controlador para su uso en las rutas
module.exports = {
  crearProducto,
  obtenerProducto,
  getAllProductos,
  actualizarProducto,
  eliminarProducto
};
