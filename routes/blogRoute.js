const express = require("express");
const { authMiddleware, esAdmin } = require("../middleware/authMiddleware");
const {
  crearBlog,
  actualizarBlog,
  obtenerBlog,
  obtenerAllBlogs,
  eliminarBlog,
  meGustaBlog,
  noMeGustaBlog,
  subirImagenes,
} = require("../controller/blogController");
const { blogImgResize, subirFoto } = require("../middleware/subirImagenes");
const router = express.Router();
router.post("/", authMiddleware, esAdmin, crearBlog);
router.put(
  "/subir/:id",
  authMiddleware,
  esAdmin,
  subirFoto.array("images", 2),
  blogImgResize,
 subirImagenes
);
router.put("/likes", authMiddleware, esAdmin, meGustaBlog);
router.put("/dislikes", authMiddleware, esAdmin, noMeGustaBlog);
router.put("/:id", authMiddleware, esAdmin, actualizarBlog);
router.delete("/:id", authMiddleware, esAdmin, eliminarBlog);
router.get("/:id", obtenerBlog);
router.get("/", obtenerAllBlogs);

module.exports = router;
