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
  restablecerContrasenia,
  loginAdmin,
  obtenerListaDeDeseo,
  guardarDirrecion,
  usuarioCarritoCompras,
  obtenerUsuarioCarrito,
  carritoVacio,
} = require("../controller/usuarioController");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/registrar", crearUsuario);
router.post("/contrasenia-olvidada-token", olvidasteContraseñaToken);
router.put("/restablecer-contrasenia/:token", restablecerContrasenia);
router.put("/contrasenia", authMiddleware, actualizarContrasenia);
router.post("/login", loginUsuarioCtrl);
router.post("/admin-login", loginAdmin);
router.post("/carrito", authMiddleware, usuarioCarritoCompras);
router.get("/usuarios", getallUsuarios);
router.get("/refrescar", manejadorReinicio);
router.get("/cerrarSesion", cerrarSesion);
router.get("/lista-de-deseos", authMiddleware, obtenerListaDeDeseo);
router.get("/carrito", authMiddleware, obtenerUsuarioCarrito);
router.get("/:id", authMiddleware, esAdmin, getUsuario);
router.delete("/carrito-vacio",authMiddleware,carritoVacio)
router.delete("/:id-usuario", deleteUsuario);
router.put("/editar-usuario", authMiddleware, updateUsuario);
router.put("/guardar-dirrecion", authMiddleware, guardarDirrecion);
router.put("/bloquear-usuario/:id", authMiddleware, esAdmin, bloquearUsuario);
router.put(
  "/desbloquear-usuario/:id",
  authMiddleware,
  esAdmin,
  desbloquearUsuario
);
module.exports = router;
