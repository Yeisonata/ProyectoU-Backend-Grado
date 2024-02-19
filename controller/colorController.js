const Color = require("../models/colorModelo.js");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId.js");

const crearColor = asyncHandler(async (req, res) => {
  try {
    const nuevaColor = await Color.create(req.body);
    res.json(nuevaColor);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarColor = await Color.findByIdAndDelete(id);
    res.json(eliminarColor);
  } catch (error) {
    throw new Error(error);
  }
});
const actualizarColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actualizarColor = await Color.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(actualizarColor);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const obtenerColor = await Color.findById(id);
    res.json(obtenerColor);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerAllColor = asyncHandler(async (req, res) => {
  try {
    const obtenerAllColor = await Color.find();
    res.json(obtenerAllColor);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearColor,
  actualizarColor,
  eliminarColor,
  obtenerColor,
  obtenerAllColor,
};
