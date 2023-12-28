//No se encuentra 404
const noEncontrado = (req, res, next) => {
  const error = new Error(`Error 404: Página no encontrada ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Manejador de errores(apis)
const errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};
module.exports = { errorHandler, noEncontrado };
