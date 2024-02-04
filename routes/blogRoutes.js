const express= require("express")
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware")
const { crearBlog, actualizarBlog, obtenerBlog, obtenerAllBlogs, eliminarBlog } = require("../controller/blogController")
const router = express.Router()
router.post("/",authMiddleware,esAdmin,crearBlog)
router.put("/:id",authMiddleware,esAdmin,actualizarBlog)
router.delete("/:id",authMiddleware,esAdmin,eliminarBlog)
router.get("/:id",obtenerBlog)
router.get("/",obtenerAllBlogs)

module.exports  = router