const { generarToken } = require("../config/jwtToken");
const Usuario = require("../models/usuarioModelo");
const asyncHandler = require("express-async-handler");
const validarMongoDbId = require("../utils/validarMongodbId");
const { actualizarRToken } = require("../config/refrescarToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const enviarCorreo = require("./correoController");

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
    res.cookie("refrescarToken", refrescarToken, {
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
  // Obtener la cookie del request
  const cookie = req.cookies;

  // Verificar si existe la propiedad refrescarToken en la cookie
  if (!cookie?.refrescarToken) throw new Error("No se actualizó la cookie");

  // Obtener el valor de refrescarToken de la cookie
  const refrescarToken = cookie.refrescarToken;

  // Buscar al usuario en la base de datos utilizando el refrescarToken
  const usuario = await Usuario.findOne({ refrescarToken });

  // Verificar si se encontró al usuario
  if (!usuario) {
    throw new Error(
      "No se pudo actualizar el token presente en la base de datos o no coincide"
    );
  }

  // Verificar la validez del refrescarToken utilizando el JWT_CLS secreto
  jwt.verify(refrescarToken, process.env.JWT_CLS, (err, decoded) => {
    if (err || usuario.id !== decoded.id) {
      throw new Error("Hay algún problema con el token de actualización");
    }

    // Generar un nuevo token de acceso
    const accesoToken = generarToken(usuario?._id);

    // Enviar el nuevo token de acceso como respuesta JSON
    res.json({ accesoToken });
  });
});

//Cerrar Sesion funcionalidad
const cerrarSesion = asyncHandler(async (req, res) => {
  // Obtener la cookie del request para comprobarlas
  const cookie = req.cookies;
  // Verificar si existe la propiedad refrescarToken en la cookie
  if (!cookie?.refrescarToken) throw new Error("No se actualizó la cookie");
  // Obtener el valor de refrescarToken de la cookie
  const refrescarToken = cookie.refrescarToken;
  // Buscar al usuario en la base de datos utilizando el refrescarToken
  const usuario = await Usuario.findOne({ refrescarToken });
  // Verificar si el usuario no fue encontrado
  if (!usuario) {
    // Limpiar la cookie y enviar una respuesta exitosa sin contenido
    res.clearCookie("refrescarToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  // Actualizar el refrescarToken del usuario en la base de datos a una cadena vacía
  await Usuario.findOneAndUpdate(
    { refrescarToken },
    {
      refrescarToken: "",
    }
  );
  // Limpiar la cookie después de la actualización y enviar una respuesta exitosa sin contenido
  res.clearCookie("refrescarToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
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
const actualizarContrasenia = asyncHandler(async (req, res) => {
  const { _id } = req.usuario || {};
  const { contrasenia } = req.body;
  validarMongoDbId(_id);

  const usuario = await Usuario.findById(_id);
  if (contrasenia) {
    usuario.contrasenia = contrasenia;
    const actualizarContrasenia = await usuario.save();
    res.json(actualizarContrasenia);
  } else {
    res.json(usuario);
  }
});

const olvidasteContraseñaToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res
      .status(404)
      .json({ mensaje: "El usuario no está registrado con este correo." });
  }

  try {
    const token = await usuario.createPasswordRestToken();
    await usuario.save();

    const URLRestablecimiento = `
      Por favor, ingrese a este enlace para restablecer tu contraseña.
      Este enlace será válido hasta 10 minutos desde este momento: 
      <a href="http://localhost:4000/api/usuario/restablecer-contrasenia/${token}">Haz clic aquí</a>
    `;

    const data = {
      to: email,
      text: "Hola Estimado Usuario",
      subject: "Contraseña Olvidada Link",
      htm: URLRestablecimiento,
    };

    enviarCorreo(data);
    res.json({ token });
  } catch (error) {
    console.error(error.mensaje);
    res.status(500).json({
      mensaje: "Error al generar el token de restablecimiento de contraseña.",
    });
  }
});
const restablecerContrasenia = asyncHandler(async (req, res) => {
  try {
    // Extraer la nueva contraseña del cuerpo de la solicitud
    const { contrasenia } = req.body;

    // Extraer el token de restablecimiento de la URL y hashearlo para comparación
    const { token } = req.params;
    const tokenHasheado = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Buscar un usuario en la base de datos con el token y que no haya expirado
    const usuario = await Usuario.findOne({
      actualizarContraseniaToken: tokenHasheado,
      expiracionRenovacionContrasenia: { $gt: Date.now() },
    });

    // Verificar si se encontró un usuario
    if (!usuario) {
      throw new Error(
        "Token expirado o no válido. Por favor, inténtalo de nuevo."
      );
    }

    // Actualizar la contraseña y limpiar campos relacionados al restablecimiento
    usuario.contrasenia = contrasenia;
    usuario.actualizarContraseniaToken = undefined;
    usuario.expiracionRenovacionContrasenia = undefined;

    // Guardar el usuario actualizado en la base de datos
    await usuario.save();

    // Enviar una respuesta JSON con el usuario actualizado
    res.json(usuario);
  } catch (error) {
    // Capturar cualquier error que ocurra durante el proceso
    res.status(500).json({ error: error.message });
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
  cerrarSesion,
  actualizarContrasenia,
  olvidasteContraseñaToken,
  restablecerContrasenia,
};
