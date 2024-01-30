const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefono: {
      type: String,
      required: true,
      unique: true,
    },
    contrasenia: {
      type: String,
      required: true,
    },
    //Rol de administrador
    roles: {
      type: String,
      default: "usuario",
    },
    estaBloqueado: {
      type: Boolean,
      default: false,
    },
    carrito: {
      type: Array,
      default: [],
    },
    direccion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Direccion" }],
    listaDeDeseos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Producto" }],
    refrescarToken: {
      type: String,
    },
    cambiarContrasenia: Date,
    actualizarContraseniaToken: String,
    expiracionRenovacionContrasenia: Date,
  },
  {
    timestamps: true,
  }
);

//Para encriptar la contraseña
userSchema.pre("save", async function (next) {
  //Para comprobar si la contraseña fue modificada
  if (!this.isModified("contrasenia")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.contrasenia = await bcrypt.hash(this.contrasenia, salt);
  next();
});


//Método para que la contraseña encriptada coincida con la ingresada
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasenia);
};
userSchema.methods.createPasswordRestToken = async function () {
  const cambiartoken = crypto.randomBytes(32).toString("hex");
  this.actualizarContraseniaToken = crypto
    .createHash("sha256")
    .update(cambiartoken)
    .digest("hex");
    this.expiracionRenovacionContrasenia=Date.now()+30*60*1000 //10 minutos
    return cambiartoken
};

//Export the model
module.exports = mongoose.model("Usuario", userSchema);
