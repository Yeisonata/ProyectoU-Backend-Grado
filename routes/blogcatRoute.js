const express = require("express");
const {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerAllCategoria,
} = require("../controller/blogcatController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, esAdmin, crearCategoria);
router.put("/:id", authMiddleware, esAdmin, actualizarCategoria);
router.delete("/:id", authMiddleware, esAdmin, eliminarCategoria);
router.get("/:id", obtenerCategoria);
router.get("/", obtenerAllCategoria);

// Exporta el router, no un objeto que contiene el router
module.exports = router;
