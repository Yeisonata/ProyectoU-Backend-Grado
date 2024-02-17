const multer = require("multer"); // Importa la biblioteca multer para manejar la carga de archivos
const sharp = require("sharp"); // Importa la biblioteca sharp para redimensionar imágenes
const path = require("path"); // Importa la biblioteca path para manejar rutas de archivos
const fs =require("fs")
// Configura el almacenamiento de archivos con multer
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) { // Define la carpeta de destino para guardar las imágenes
    cb(null, path.join(__dirname, "../public/images")); // Utiliza la ruta absoluta para guardar las imágenes en la carpeta "public/images"
  },
  filename: function (req, file, cb) { // Define el nombre de archivo para las imágenes
    const sufijoUnico = Date.now() + "-" + Math.round(Math.random() * 1e9); // Genera un sufijo único para evitar conflictos de nombres de archivo
    cb(null, file.fieldname + "-" + sufijoUnico + ".jpeg"); // Concatena el nombre del campo del archivo con el sufijo único y la extensión ".jpeg"
  },
});

// Función para filtrar archivos según su tipo MIME
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) { // Verifica si el archivo es una imagen
    cb(null, true); // Permite el archivo si es una imagen
  } else {
    cb(
      {
        message: "Formato de archivo no es compatible", // Retorna un error si el formato del archivo no es compatible
      },
      false
    );
  }
};

// Configura multer para subir archivos con las opciones definidas
const subirFoto = multer({
  storage: multerStorage, // Utiliza el almacenamiento definido anteriormente
  fileFilter: multerFilter, // Utiliza el filtro definido para aceptar solo imágenes
  limits: { fieldSize: 2000000 }, // Limita el tamaño de los archivos a 2MB
});

// Función para redimensionar imágenes de productos
const productoImgResize = async (req, res, next) => {
  if (!req.files) return next(); // Si no hay archivos, pasa al siguiente middleware
  await Promise.all( // Utiliza Promise.all para procesar todas las imágenes en paralelo
    req.files.map(async (file) => { // Mapea sobre los archivos subidos
      await sharp(file.path) // Utiliza sharp para redimensionar las imágenes
        .resize(300, 300) // Define el tamaño de redimensionamiento
        .toFormat("jpeg") // Convierte las imágenes a formato JPEG
        .jpeg({ quality: 90 }) // Define la calidad de compresión JPEG
        .toFile(`public/images/productos/${file.filename}`); // Guarda las imágenes redimensionadas en una carpeta específica
        fs.unlinkSync(`public/images/productos/${file.filename}`)
    })
  );
  next(); // Llama al siguiente middleware
};

// Función para redimensionar imágenes de blogs (similar a la anterior)
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
        fs.unlinkSync(`public/images/blogs/${file.filename}`)

    })
  );
  next();
};

// Exporta las funciones y el middleware para su uso en otras partes de la aplicación
module.exports = {
  subirFoto,
  productoImgResize,
  blogImgResize,
};
