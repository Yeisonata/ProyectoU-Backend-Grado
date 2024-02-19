const Contacto = require("../models/contactoModelo.js");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId.js");

const crearContacto = asyncHandler(async (req, res) => {
  try {
    const nuevacontacto = await Contacto.create(req.body);
    res.json(nuevacontacto);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarContacto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarcontacto = await Contacto.findByIdAndDelete(id);
    res.json(eliminarcontacto);
  } catch (error) {
    throw new Error(error);
  }
});
const actualizarContacto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actualizarcontacto = await Contacto.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(actualizarcontacto);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerContacto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const obtenercontacto = await Contacto.findById(id);
    res.json(obtenercontacto);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerAllContacto = asyncHandler(async (req, res) => {
  try {
    const obtenerAllcontacto = await Contacto.find();
    res.json(obtenerAllcontacto);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearContacto,
  actualizarContacto,
  eliminarContacto,
  obtenerContacto,
  obtenerAllContacto,
};
