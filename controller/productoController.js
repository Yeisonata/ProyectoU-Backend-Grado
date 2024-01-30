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
    const productoEliminado = await Producto.findOneAndDelete(id);

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
    // consulta que recopila los parámetros de la solicitud
    const queryObje = { ...req.query };
    const excluirCampos = ["pagina", "calificaciones", "limite", "campos"];
    excluirCampos.forEach((el) => delete queryObje[el]);
    let queryStr = JSON.stringify(queryObje);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Producto.find(JSON.parse(queryStr));

    //Funcion para ordenar los productos
    if (req.query.sort) {
      const ordenadoPor = req.query.sort.split(",").join("");
      query = query.sort(ordenadoPor);
    } else {
      query = query.sort("-createdAt");
    }

    //Limitar los campos
    if (req.query.campos) {
      const limitador = req.query.campos.split(",").join(" ");
      query = query.select(limitador);
    } else {
      query = query.select("-__v");
    }
    //paginado
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const omitir = (pagina - 1) * limite;
    query = query.skip(omitir).limit(limite);
    if (req.query.pagina) {
      const recuentoProducto = await Producto.countDocuments();
      if (omitir >= recuentoProducto) throw new Error("Esta pagina no existe");
    }
    // console.log(pagina, limite, omitir);

    // Utiliza el modelo de productos para buscar todos los productos en la base de datos
    const producto = await query;
    //
    // Responde con la lista de todos los productos en formato JSON
    res.json(producto);
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
  eliminarProducto,
};
