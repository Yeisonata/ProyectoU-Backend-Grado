const Blog = require("../models/blogModelo");
const Usuario = require("../models/usuarioModelo");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId");

const crearBlog = asyncHandler(async (req, res) => {
  try {
    const nuevoBlog = await Blog.create(req.body);
    res.json(nuevoBlog);
  } catch (error) {
    throw new Error(error);
  }
});

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
const obtenerBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const obtenerBlog = await Blog.findById(id);
    const actualizarVisitas = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numeroVisitas: 1 },
      },
      { new: true }
    );
    res.json( actualizarVisitas);
  } catch (error) {
    throw new Error(error);
  }
});

const obtenerAllBlogs =asyncHandler(async(req,res)=>{
  try {
    const obtenerAllBlogs  = await Blog.find()
    res.json(obtenerAllBlogs );
  } catch (error) {
    throw new Error(error)
  }
})
const eliminarBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const eliminarBlog = await Blog.findByIdAndDelete(id)
    res.json(eliminarBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { crearBlog, actualizarBlog, obtenerBlog,obtenerAllBlogs,eliminarBlog };
