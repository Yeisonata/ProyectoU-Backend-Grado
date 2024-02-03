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
  cerrarSesion,
  actualizarContrasenia,
  olvidasteContraseñaToken,
  restablecerContrasenia
} = require("../controller/usuarioController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/registrar", crearUsuario);
router.post("/contrasenia-olvidada-token",olvidasteContraseñaToken)
router.put("/restablecer-contrasenia/:token",restablecerContrasenia)
router.put("/contrasenia",authMiddleware,actualizarContrasenia)
router.post("/login", loginUsuarioCtrl);
router.get("/usuarios", getallUsuarios);
router.get("/refrescar", manejadorReinicio);
router.get("/cerrarSesion",cerrarSesion)
router.get("/:id-usuario", authMiddleware, esAdmin, getUsuario);
router.delete("/:id-usuario", deleteUsuario);
router.put("/editar-usuario", authMiddleware, updateUsuario);
router.put("/bloquear-usuario/:id", authMiddleware,esAdmin, bloquearUsuario);
router.put("/desbloquear-usuario/:id", authMiddleware,esAdmin,desbloquearUsuario);
module.exports = router;
