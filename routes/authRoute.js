const express = require("express");
const {
  crearUsuario,
  loginUsuarioCtrl,
  getallUsuarios,
  getUsuario,
  deleteUsuario,
  updateUsuario,
  bloquearUsuario,
  desbloquearUsuario,
  manejadorReinicio,
} = require("../controller/usuarioController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const { actualizarRToken } = require("../config/refrescarToken");
const router = express.Router();

router.post("/registrar", crearUsuario);
router.post("/login", loginUsuarioCtrl);
router.get("/usuarios", getallUsuarios);
router.get("/:id-usuario", authMiddleware, esAdmin, getUsuario);
router.delete("/:id-usuario", deleteUsuario);
router.put("/editar-usuario", authMiddleware, updateUsuario);
router.put("/bloquear-usuario/:id", authMiddleware,esAdmin, bloquearUsuario);
router.put("/desbloquear-usuario/:id", authMiddleware,esAdmin,desbloquearUsuario);
router.get("/refrescar", manejadorReinicio);
module.exports = router;
