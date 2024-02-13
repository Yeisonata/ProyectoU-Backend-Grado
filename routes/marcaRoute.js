const express = require("express");
const {
  crearMarca,
  actualizarMarca,
  eliminarMarca,
  obtenerMarca,
  obtenerAllMarca,
} = require("../controller/marcaController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, esAdmin, crearMarca);
router.put("/:id", authMiddleware, esAdmin, actualizarMarca);
router.delete("/:id", authMiddleware, esAdmin, eliminarMarca);
router.get("/:id", obtenerMarca);
router.get("/", obtenerAllMarca);

// Exporta el router, no un objeto que contiene el router
module.exports = router;
