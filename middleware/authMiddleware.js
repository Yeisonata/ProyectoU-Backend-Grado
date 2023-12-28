//Para verificar la ficha JWT(Para que para verificar si el usuario es administrador o no)
const Usuario = require("../models/usuarioModelo");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodificar = jwt.verify(token, process.env.JWT_CLS);
        const usuario = await Usuario.findById(decodificar?.id);
        req.usuario = usuario;
        next();
      }
    } catch (error) {
      throw new Error(
        "No estas autorizado token expirado, Por favor iniciar session nuevamente"
      );
    }
  } else {
    throw new Error("No existe ningún Token adjuntado al encabezado");
  }
});

const esAdmin = asyncHandler(async(req,res,next)=>{
  const {email} = req.usuario
  const adminUsuario =await Usuario.findOne({email})
  if(adminUsuario.roles !=="admin"){
 throw new Error("No eres administrador")
  }else{
    next()
  }

})
module.exports = { authMiddleware,esAdmin };
