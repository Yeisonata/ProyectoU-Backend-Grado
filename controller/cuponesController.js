const Cupon = require("../models/cuponesModelo");
const validarMongoDbId = require("../utils/validarMongodbId.js");
const asynHandler = require("express-async-handler");

const crearCupon = asynHandler(async (req, res) => {
  try {
    const nuevoCupon = await Cupon.create(req.body);
    res.json(nuevoCupon);
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerAllCupones = asynHandler(async (req, res) => {
  try {
    const cupones = await Cupon.find();
    res.json(cupones);
  } catch (error) {
    throw new Error(error);
  }
});
const actualizarCupones = asynHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actulizarcupon = await Cupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(actulizarcupon);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarCupones = asynHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarcupon = await Cupon.findByIdAndDelete(id);
    res.json(eliminarcupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  crearCupon,
  obtenerAllCupones,
  actualizarCupones,
  eliminarCupones
};
