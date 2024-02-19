const express = require("express");
const {
  crearContacto,
  actualizarContacto,
  eliminarContacto,
  obtenerContacto,
  obtenerAllContacto,
} = require("../controller/contactoController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", crearContacto);
router.put("/:id", authMiddleware, esAdmin, actualizarContacto);
router.delete("/:id", authMiddleware, esAdmin, eliminarContacto);
router.get("/:id", obtenerContacto);
router.get("/", obtenerAllContacto);

// Exporta el router, no un objeto que contiene el router
module.exports = router;
