export class CustomError {
    static createError(nombre="error", mensaje, statusCode, codigoInterno, descripcion = "") {
        const error = new Error(mensaje);
        error.name = nombre;
        error.codigo = statusCode;
        error.codigoInterno = codigoInterno;
        error.descripcion = descripcion;

        return error;
    }
}
// export class CustomError extends Error {
//     constructor(nombre, mensaje, statusCode, codigoInterno, descripcion) {
//       super(mensaje);
//       this.nombre = nombre;
//       this.statusCode = statusCode;
//       this.codigoInterno = codigoInterno;
//       this.descripcion = descripcion;
//     }
//   }