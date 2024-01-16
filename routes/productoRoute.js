// Importar el módulo express
const express = require("express");

// Importar el controlador de productos
const { crearProducto } = require("../controller/productoController");

// Crear una instancia de Router de express
const router = express.Router();

// Ruta POST para la creación de productos, utiliza el controlador crearProducto
router.post("/", crearProducto);

// Exportar el router para su uso en la aplicación principal
module.exports = router;
