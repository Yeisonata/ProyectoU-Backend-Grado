const express= require("express")
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware")
const { crearBlog, actualizarBlog } = require("../controller/blogController")
const router = express.Router()
router.post("/",authMiddleware,esAdmin,crearBlog)
router.put("/:id",authMiddleware,esAdmin,actualizarBlog)

module.exports  = router