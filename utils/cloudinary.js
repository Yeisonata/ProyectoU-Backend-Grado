// Importar la biblioteca Cloudinary
const cloudinary = require("cloudinary");

// Configurar Cloudinary con las credenciales de la aplicación
cloudinary.config({
  cloud_name: process.env.CLOUD_TIENDA,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

// Función para subir una imagen a Cloudinary
const cloudinarySubirImagen = async (fileToUploads) => {
  // Devolver una promesa que se resuelve con la URL de la imagen subida
  return new Promise((resolve) => {
    // Utilizar el método 'uploader.upload' de Cloudinary para subir la imagen
    cloudinary.uploader.upload(fileToUploads, (result) => {
      // Resolver la promesa con la URL segura de la imagen subida
      resolve({
        url: result.secure_url, // URL segura de la imagen
        asset_id:result.asset_id,
        public_id:result.public_id
      },{
        resource_type: "auto" // Tipo de recurso (automático)
      });
    });
  });
};
const cloudinaryEliminarImagen = async (fileToDelete) => {
  // Devolver una promesa que se resuelve con la URL de la imagen subida
  return new Promise((resolve) => {
    // Utilizar el método 'uploader.upload' de Cloudinary para subir la imagen
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      // Resolver la promesa con la URL segura de la imagen subida
      resolve({
        url: result.secure_url, // URL segura de la imagen
        asset_id:result.asset_id,
        public_id:result.public_id
      },{
        resource_type: "auto" // Tipo de recurso (automático)
      });
    });
  });
};

// Exportar la función 'cloudinarySubirImagen' para su uso en otros módulos
module.exports = {cloudinarySubirImagen,cloudinaryEliminarImagen};
