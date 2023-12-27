import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname
//genera el hash en la contraseña con 10 saltos
export const crearHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//con "comparesync" compara la password ingresada con la password de la BD(usuario)
export const validPassword=(usuario, password)=>bcrypt.compareSync(password,usuario.password)