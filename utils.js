import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'; // Importar la función v4 de la biblioteca uuid para generar UUIDs


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname
//genera el hash en la contraseña con 10 saltos
export const crearHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//con "comparesync" compara la password ingresada con la password de la BD(usuario)
export const validPassword=(usuario, password)=>bcrypt.compareSync(password,usuario.password)

export function validTypeData(product){
    const checkTypes = (value, type) => typeof value === type;
    product.thumbnail = Array.isArray(product.thumbnail) ? product.thumbnail : [];
    let OK =
      checkTypes(product.title, "string") &&
      checkTypes(product.description, "string") &&
      checkTypes(product.code, "number") &&
      checkTypes(product.price, "number") &&
      checkTypes(product.status, "boolean") &&
      checkTypes(product.stock, "number") &&
      checkTypes(product.category, "string") &&
      Array.isArray(product.thumbnail);
return OK
}

export function generateUniqueCode() {
    return uuidv4(); // Generar un UUID v4 como código único
}