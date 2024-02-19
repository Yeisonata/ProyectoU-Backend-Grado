const { generarToken } = require("../config/jwtToken");
const Usuario = require("../models/usuarioModelo");
const Producto = require("../models/productoModelo");
const Carrito = require("../models/carritoModelo");
const Cupon = require("../models/cuponesModelo");
const Pedido = require("../models/pedidoModelo");
const uniqid = require("uniqid");
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

//Controlador de inicio de session Usuario
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

////Controlador de inicio de session Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, contrasenia } = req.body;
  // Verificar si el admin existe o no
  const buscarAdmin = await Usuario.findOne({ email });
  // Verificar si se encontró un usuario y si tiene el rol de "admin"
  if (buscarAdmin && buscarAdmin.roles === "admin") {
    // Si el usuario es un administrador, comprobar su contraseña
    if (await buscarAdmin.isPasswordMatched(contrasenia)) {
      const refrescarToken = await actualizarRToken(buscarAdmin?._id);
      const actualizarusuario = await Usuario.findByIdAndUpdate(
        buscarAdmin.id,
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
        // Estableciendo la duracion de la cookie 74 horas (en milisegundos)
        maxAge: 74 * 60 * 60 * 1000,
      });
      res.json({
        _id: buscarAdmin?._id,
        nombres: buscarAdmin?.nombres,
        apellidos: buscarAdmin?.apellidos,
        email: buscarAdmin?.email,
        telefono: buscarAdmin?.telefono,
        token: generarToken(buscarAdmin?._id),
      });
    } else {
      throw new Error("Credenciales inválidas");
    }
  } else {
    throw new Error("No estás autorizado");
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

//Método para Guardar dirección del usuario
const guardarDirrecion = asyncHandler(async (req, res, next) => {
  const { _id } = req.usuario;
  validarMongoDbId(_id);
  try {
    const updateUsuario = await Usuario.findByIdAndUpdate(
      _id,
      {
        direccion: req?.body?.direccion,
      },
      {
        new: true,
      }
    );
    res.json(updateUsuario);
    // console.log(updateUsuario);
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
// Controlador para obtener la lista de deseos de un usuario
const obtenerListaDeDeseo = asyncHandler(async (req, res) => {
  // Obtener el ID del usuario de la solicitud
  const { _id } = req.usuario;
  try {
    // Encontrar al usuario en la base de datos y poblar su lista de deseos
    const encontrarUsuario = await Usuario.findById(_id).populate(
      "listaDeDeseos"
    );
    // Responder con la lista de deseos del usuario en formato JSON
    res.json(encontrarUsuario);
  } catch (error) {
    // Manejar errores y lanzar una excepción con el mensaje de error
    throw new Error(error);
  }
});
// Controlador para manejar la creación del carrito de compras para un usuario
const usuarioCarritoCompras = asyncHandler(async (req, res) => {
  // Extraer el carrito de la solicitud
  const { carrito } = req.body;
  // Extraer el ID de usuario de la solicitud
  const { _id } = req.usuario;
  // Validar el ID de usuario utilizando una función auxiliar
  validarMongoDbId(_id);
  try {
    let productos = [];
    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findById(_id);

    // Verificar si el usuario ya tiene un carrito de compras existente y eliminarlo si es así
    const yaExistenteCarrito = await Carrito.findOne({ ordenPor: usuario._id });
    if (yaExistenteCarrito) {
      yaExistenteCarrito.remove();
    }

    // Iterar sobre los productos en el carrito enviado en la solicitud
    for (let i = 0; i < carrito.length; i++) {
      let object = {};
      object.producto = carrito[i]._id;
      object.cuenta = carrito[i].cuenta;
      object.color = carrito[i].color;

      // Obtener el precio del producto desde la base de datos
      let obtenerPrecio = await Producto.findById(carrito[i]._id)
        .select("precio")
        .exec();
      object.precio = obtenerPrecio.precio;

      productos.push(object);
    }

    // Calcular el precio total del carrito
    let carritoTotal = 0;
    for (let i = 0; i < productos.length; i++) {
      carritoTotal += productos[i].precio * productos[i].cuenta;
    }

    // Crear y guardar un nuevo carrito de compras en la base de datos
    let nuevoCarrito = await new Carrito({
      productos,
      carritoTotal,
      ordenPor: usuario?._id,
    }).save();

    // Responder con el carrito de compras creado en formato JSON
    res.json(nuevoCarrito);
  } catch (error) {
    // Capturar y lanzar cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});

// Controlador para obtener el carrito de compras de un usuario
const obtenerUsuarioCarrito = asyncHandler(async (req, res) => {
  // Extraer el ID de usuario de la solicitud
  const { _id } = req.usuario;
  // Validar el ID de usuario utilizando una función auxiliar
  validarMongoDbId(_id);
  try {
    // Buscar el carrito de compras del usuario en la base de datos y poblar los detalles del producto
    const carrito = await Carrito.findOne({ ordenPor: _id }).populate(
      "productos.producto"
    );
    // Responder con el carrito de compras del usuario en formato JSON
    res.json(carrito);
  } catch (error) {
    // Capturar y lanzar cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});

// Controlador para vaciar el carrito de compras de un usuario
const carritoVacio = asyncHandler(async (req, res) => {
  // Extraer el ID de usuario de la solicitud
  const { _id } = req.usuario;
  // Validar el ID de usuario utilizando una función auxiliar
  validarMongoDbId(_id);
  try {
    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findOne({ _id });
    // Eliminar el carrito de compras del usuario de la base de datos
    const carrito = await Carrito.findOneAndDelete({ ordenPor: usuario._id });
    // Responder con el carrito de compras eliminado en formato JSON
    res.json(carrito);
  } catch (error) {
    // Capturar y lanzar cualquier error que ocurra durante el proceso
    throw new Error(error);
  }
});
const aplicarCupon = asyncHandler(async (req, res) => {
  const { cupon } = req.body;
  // Extraer el ID de usuario de la solicitud
  const { _id } = req.usuario;
  // Validar el ID de usuario utilizando una función auxiliar
  validarMongoDbId(_id);
  const cuponValido = await Cupon.findOne({ nombre: cupon });
  if (cuponValido === null) {
    throw new Error("Cupon no valido");
  }
  const usuario = await Usuario.findOne({ _id });
  let { carritoTotal } = await Carrito.findOne({
    ordenPor: usuario._id,
  }).populate("productos.producto");
  let totalDespuesDescuento = (
    carritoTotal -
    (carritoTotal * cuponValido.descuento) / 100
  ).toFixed(2);
  await Carrito.findOneAndUpdate(
    { ordenPor: usuario._id },
    { totalDespuesDescuento },
    { new: true }
  );
  res.json(totalDespuesDescuento);
});
const crearOrden = asyncHandler(async (req, res) => {
  const { COD, cuponAplicado } = req.body;
  const { _id } = req.usuario;
  validarMongoDbId(_id);
  try {
    if (!COD) throw new Error("Error al crear orden de entrega");
    const usuario = await Usuario.findById(_id);
    let usoCarrito = await Carrito.findOne({ ordenPor: usuario._id });
    let cantidadFinal = 0;
    if (cuponAplicado && usoCarrito.totalDespuesDescuento) {
      cantidadFinal = usoCarrito.totalDespuesDescuento;
    } else {
      cantidadFinal = usoCarrito.carritoTotal;
    }

    let nuevaOrden = await new Pedido({
      productos: usoCarrito.productos,
      metodoPago: {
        id: uniqid(),
        metodo: "COD", // Pago contra entrega
        cantidad: cantidadFinal,
        estado: "Efectivo o Entrega",
        creado: Date.now(),
        moneda: "COP",
      },
      ordenPor: usuario._id,
      estadoOrden: "Efectivo O Entrega",
    }).save();
    let actualizar = usoCarrito.productos.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.producto._id },
          update: { $inc: { cantidad: -item.cuenta, vendido: +item.cuenta } },
        },
      };
    });
    const actualizado = await Producto.bulkWrite(actualizar, {});
    res.json({ message: "Exitosamente" });
  } catch (error) {
    throw new Error(error);
  }
});
const obtenerOrdenes = asyncHandler(async (req, res) => {
  const { _id } = req.usuario;
  validarMongoDbId(_id);
  try {
    const usuarioOrdenes = await Pedido.findOne({ ordenPor: _id })
      .populate("productos.producto")
      .exec();
    res.json(usuarioOrdenes);
  } catch (error) {
    throw new Error(error);
  }
});

const actualizarEstadoOrden = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;
  validarMongoDbId(id);
  try {
    const actualizarEstadoOrden = await Pedido.findByIdAndUpdate(
      id,
      { estadoOrden: estado,
        metodoPago:{
          estado:estado,
        }
      },
      { new: true }
    );
    res.json(actualizarEstadoOrden)
  } catch (error) {
    throw new Error(error)
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
  loginAdmin,
  obtenerListaDeDeseo,
  guardarDirrecion,
  usuarioCarritoCompras,
  obtenerUsuarioCarrito,
  carritoVacio,
  aplicarCupon,
  crearOrden,
  obtenerOrdenes,
  actualizarEstadoOrden,
};
