// Importar el módulo express
const express = require("express");

// Importar el controlador de productos
const {
  crearProducto,
  obtenerProducto,
  getAllProductos,
  actualizarProducto,
  eliminarProducto,
} = require("../controller/productoController");

// Importa las funciones 'esAdmin' y 'authMiddleware' desde el módulo 'authMiddleware'
// authMiddleware: Verifica autenticación y detiene si falla; permite al siguiente middleware si es exitosa.
// esAdmin: Verifica permisos de administrador y detiene si no es un administrador; permite al siguiente middleware si es un administrador.
const { esAdmin, authMiddleware } = require("../middleware/authMiddleware");

// Crear una instancia de Router de express
const router = express.Router();

// Ruta POST para la creación de productos, utiliza el controlador crearProducto
router.post("/", authMiddleware, esAdmin, crearProducto);
// Ruta GET para obtener un producto por id, utilizando el controlador  obtenerProducto
router.get("/:id", obtenerProducto);

router.put("/:id", authMiddleware, esAdmin, actualizarProducto);
router.delete("/:id", authMiddleware, esAdmin, eliminarProducto);
router.get("/", getAllProductos);

// Exportar el router para su uso en la aplicación principal
module.exports = router;
