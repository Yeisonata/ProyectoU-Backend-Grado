const express = require("express");
const {
  crearCupon,
  obtenerAllCupones,
  actualizarCupones,
  eliminarCupones,
} = require("../controller/cuponesController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, esAdmin, crearCupon);
router.get("/", authMiddleware, esAdmin, obtenerAllCupones);
router.put("/:id", authMiddleware, esAdmin, actualizarCupones);
router.delete("/:id", authMiddleware, esAdmin, eliminarCupones);

module.exports = router;
