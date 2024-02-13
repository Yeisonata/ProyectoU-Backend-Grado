//Creación del servidor con express
const bodyParser = require("body-parser");
const express = require("express");
const dbConexion = require("./config/dbConexion");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4005;
const authRouter = require("./routes/authRoute");
const productoRouter = require("./routes/productoRoute");
const blogRouter = require("./routes/blogRoute");
const categoriaRouter = require("./routes/prodcategoriaRoute");
const blogcategoriaRouter = require("./routes/blogcatRoute");
const MarcaRouter = require("./routes/marcaRoute");
const CuponRouter = require("./routes/cuponesRoute");

const cookieParser = require("cookie-parser");
const { noEncontrado, errorHandler } = require("./middleware/manejadorError");
const morgan = require("morgan");
dbConexion();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/usuario", authRouter);
app.use("/api/producto", productoRouter);
app.use("/api/blog", blogRouter);
app.use("/api/categoria", categoriaRouter);
app.use("/api/blogcategoria", blogcategoriaRouter);
app.use("/api/marca", MarcaRouter);
app.use("/api/cupon", CuponRouter);

app.use(noEncontrado);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`La aplicación está funcionando en http://localhost:${PORT}`);
});
