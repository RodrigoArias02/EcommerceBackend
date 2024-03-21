export const errorHandler = (error, req, res, next) => {

  if (error) {
    if (error.codigo) {
        console.log(error.codigo)
      console.log(
        `(Error codigo ${error.codigoInterno}) - ${error.name}: ${error.message}. Detalle: ${error.descripcion}`
      );
      return res.status(error.codigo).json({ error: `${error.name}: ${error.message}` });
    } else {
      console.error("Error inesperado:", error);
      return res.status(500).json({errorr:"Errorr inesperado en el servidor - Intente más tarde, o contacte a su administrador", msgError:error});
    }
  }
  next();
};

export const errorLoggers = (err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).send("Something broke!");
};

export const ErrorSearchRouter = (req, res, next) => {
    if (!res.headersSent) { // Verificar si no se ha enviado una respuesta anteriormente
      res.status(404).send("La ruta no se encontró");
    } else {
      next(); // Llamar a next() para pasar al siguiente middleware
    }
  };
  
