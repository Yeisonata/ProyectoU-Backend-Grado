const Categoria = require("../models/blogcatModelo.js");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId.js");

const crearCategoria = asyncHandler(async (req, res) => {
  try {
    const nuevaCategoria = await Categoria.create(req.body);
    res.json(nuevaCategoria);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarCategoria = await Categoria.findByIdAndDelete(id);
    res.json(eliminarCategoria);
  } catch (error) {
    throw new Error(error);
  }
});
const actualizarCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actualizarCategoria = await Categoria.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(actualizarCategoria);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerCategoria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const obtenerCategoria = await Categoria.findById(id);
    res.json(obtenerCategoria);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerAllCategoria = asyncHandler(async (req, res) => {
  try {
    const obtenerAllCategoria = await Categoria.find();
    res.json(obtenerAllCategoria);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerAllCategoria,
};
