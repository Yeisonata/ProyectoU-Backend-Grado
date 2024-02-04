const Blog = require("../models/blogModelo")
const Usuario = require("../models/usuarioModelo")
const asyncHandler = require("express-async-handler")
const validarMongoDbId = require("../utils/validarMongodbId");

const crearBlog = asyncHandler(async(req,res)=>{
try {
  const nuevoBlog = await Blog.create(req.body)
  res.json(
    nuevoBlog,
  )
} catch (error) {
  throw new Error(error)
}
})
const actualizarBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const actualizarBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(actualizarBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {crearBlog,actualizarBlog}