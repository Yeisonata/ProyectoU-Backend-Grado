const { generarToken } = require("../config/jwtToken");
const Usuario = require("../models/usuarioModelo");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId");
const { actualizarRToken } = require("../config/refrescarToken");

const crearUsuario = asyncHandler(async (req, res) => {
  //comprobar si el usuario existe
  const email = req.body.email;
  const buscarUsuario = await Usuario.findOne({ email: email });
  if (!buscarUsuario) {
    //Crear un nuevo usuario
    const newUsuario = await Usuario.create(req.body);
    res.json(newUsuario);
  } else {
    //Usuario existente
    throw new Error("Usuario ya existe");
  }
});

//Controlador de inicio de session
const loginUsuarioCtrl = asyncHandler(async (req, res) => {
  const { email, contrasenia } = req.body;
  //Verificar si el usuario existe o no
  const buscarUsuario = await Usuario.findOne({ email });
  //Buscar y comprobar al usuario y que coincida con su contraseña
  if (buscarUsuario && (await buscarUsuario.isPasswordMatched(contrasenia))) {
    const refrescarToken = await actualizarRToken(buscarUsuario?._id);
    const actualizarusuario = await Usuario.findByIdAndUpdate(
      buscarUsuario.id,
      {
        refrescarToken: refrescarToken,
      },
      {
        new: true,
      }
    );
    res.cookie("actualizarToken", refrescarToken, {
      // Configuración para la cookie  solo sea accesible a través de HTTP y no desde JavaScript en el navegador
      httpOnly: true,
      //Estableciendo la duracion de la cookie 74 horas(en milisegundos)
      maxAge: 74 * 60 * 60 * 1000,
    });
    res.json({
      _id: buscarUsuario?._id,
      nombres: buscarUsuario?.nombres,
      apellidos: buscarUsuario?.apellidos,
      email: buscarUsuario?.email,
      telefono: buscarUsuario?.telefono,
      token: generarToken(buscarUsuario?._id),
    });
  } else {
    throw new Error("Credenciales inválidas");
  }
});

//manejador de token de actualización
const manejadorReinicio = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
});

//Actualizar Usuarios
const updateUsuario = asyncHandler(async (req, res) => {
  const { _id } = req.usuario;
  validarMongoDbId(_id);
  try {
    const updateUsuario = await Usuario.findByIdAndUpdate(
      _id,
      {
        nombres: req?.body?.nombres,
        apellidos: req?.body?.apellidos,
        email: req?.body?.email,
        telefono: req?.body?.telefono,
      },
      {
        new: true,
      }
    );
    res.json(updateUsuario);
  } catch (error) {
    throw new Error(error);
  }
});

//obtener  los usuarios
const getallUsuarios = asyncHandler(async (req, res) => {
  try {
    const getUsuarios = await Usuario.find();
    res.json(getUsuarios);
  } catch (error) {
    throw new Error(error);
  }
});

//Buscar un usuario en  especifico
const getUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const getUsuario = await Usuario.findById(id);
    res.json({
      getUsuario,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Eliminar un usuario en  especifico
const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const deleteUsuario = await Usuario.findByIdAndDelete(id);
    res.json({
      deleteUsuario,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Método para bloquear usuarios
const bloquearUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const bloquear = await Usuario.findByIdAndUpdate(
      id,
      {
        estaBloqueado: true,
      },
      {
        new: true,
      }
    );
    res.json(bloquear);
  } catch (error) {
    throw new Error(error);
  }
});
//Método para desbloquear usuarios
const desbloquearUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const desbloquear = await Usuario.findByIdAndUpdate(
      id,
      {
        estaBloqueado: false,
      },
      {
        new: true,
      }
    );
    res.json(desbloquear);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  crearUsuario,
  loginUsuarioCtrl,
  getallUsuarios,
  getUsuario,
  deleteUsuario,
  updateUsuario,
  bloquearUsuario,
  desbloquearUsuario,
  manejadorReinicio,
};
