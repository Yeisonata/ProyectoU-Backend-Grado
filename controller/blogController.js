const Blog = require("../models/blogModelo");
const Usuario = require("../models/usuarioModelo");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId");
const cloudinarySubirImagen = require("../utils/cloudinary");
const fs = require("fs");

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
  validarMongoDbId(id);
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
  validarMongoDbId(id);
  try {
    const obtenerBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const actualizarVisitas = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numeroVisitas: 1 },
      },
      { new: true }
    );
    res.json(obtenerBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const obtenerAllBlogs = asyncHandler(async (req, res) => {
  try {
    const obtenerAllBlogs = await Blog.find();
    res.json(obtenerAllBlogs);
  } catch (error) {
    throw new Error(error);
  }
});
const eliminarBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const eliminarBlog = await Blog.findByIdAndDelete(id);
    res.json(eliminarBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const meGustaBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validarMongoDbId(blogId);

  const blog = await Blog.findById(blogId);
  const inicioIdUsuario = req?.usuario?._id;

  const esMeGustas = blog?.esMeGustas;

  const yaNoMeGusta = blog?.dislikes?.find(
    (usuarioId) => usuarioId?.toString() === inicioIdUsuario?.toString()
  );

  if (yaNoMeGusta) {
    const blogActualizado = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: inicioIdUsuario },
        esNoMeGustas: false,
      },
      { new: true }
    );
    res.json(blogActualizado);
  }

  if (esMeGustas) {
    const blogActualizado = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: inicioIdUsuario },
        esMeGustas: false,
      },
      { new: true }
    );
    res.json(blogActualizado);
  } else {
    const blogActualizado = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: inicioIdUsuario },
        esMeGustas: true,
      },
      { new: true }
    );
    res.json(blogActualizado);
  }
});

const noMeGustaBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validarMongoDbId(blogId);

  const blog = await Blog.findById(blogId);
  const inicioIdUsuario = req?.usuario?._id;

  const esNoMeGustas = blog?.esNoMeGustas;

  const yaMeGusta = blog?.likes?.find(
    (usuarioId) => usuarioId?.toString() === inicioIdUsuario?.toString()
  );

  if (yaMeGusta) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: inicioIdUsuario },
        esMeGustas: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }

  if (esNoMeGustas) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: inicioIdUsuario },
        esNoMeGustas: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: inicioIdUsuario },
        esNoMeGustas: true,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }
});
const subirImagenes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const subidor = (path) => cloudinarySubirImagen(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await subidor(path);
      urls.push(newpath);
      fs.unlinkSync(path)
    }
    const encontrarBlog = await Blog.findByIdAndUpdate(
      id,
      {
        imagenes: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(encontrarBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearBlog,
  actualizarBlog,
  obtenerBlog,
  obtenerAllBlogs,
  eliminarBlog,
  meGustaBlog,
  noMeGustaBlog,
  subirImagenes
};
