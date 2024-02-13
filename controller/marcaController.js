const Marca = require("../models/marcaModelo.js");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId.js");

const crearMarca = asyncHandler(async (req, res) => {
  try {
    const nuevaMarca = await Marca.create(req.body);
    res.json(nuevaMarca);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarMarca = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarMarca = await Marca.findByIdAndDelete(id);
    res.json(eliminarMarca);
  } catch (error) {
    throw new Error(error);
  }
});
const actualizarMarca = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actualizarMarca = await Marca.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(actualizarMarca);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerMarca = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const obtenerMarca = await Marca.findById(id);
    res.json(obtenerMarca);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerAllMarca = asyncHandler(async (req, res) => {
  try {
    const obtenerAllMarca = await Marca.find();
    res.json(obtenerAllMarca);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearMarca,
  actualizarMarca,
  eliminarMarca,
  obtenerMarca,
  obtenerAllMarca,
};
