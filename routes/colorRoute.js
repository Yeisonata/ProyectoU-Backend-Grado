const express = require("express");
const {
  crearColor,
  actualizarColor,
  eliminarColor,
  obtenerColor,
  obtenerAllColor,
} = require("../controller/colorController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, esAdmin, crearColor);
router.put("/:id", authMiddleware, esAdmin, actualizarColor);
router.delete("/:id", authMiddleware, esAdmin, eliminarColor);
router.get("/:id", obtenerColor);
router.get("/", obtenerAllColor);

// Exporta el router, no un objeto que contiene el router
module.exports = router;
