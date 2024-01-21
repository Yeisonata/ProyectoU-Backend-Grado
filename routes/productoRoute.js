// Importar el módulo express
const express = require("express");

// Importar el controlador de productos
const { crearProducto, obtenerProducto, getAllProductos, actualizarProducto, eliminarProducto } = require("../controller/productoController");

// Crear una instancia de Router de express
const router = express.Router();

// Ruta POST para la creación de productos, utiliza el controlador crearProducto
router.post("/", crearProducto);
// Ruta GET para obtener un producto por id, utilizando el controlador  obtenerProducto
router.get("/:id", obtenerProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);
router.get("/", getAllProductos);

// Exportar el router para su uso en la aplicación principal
module.exports = router;
