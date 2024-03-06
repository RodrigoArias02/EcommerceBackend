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
    const checkTypes = (value, type) => typeof value == type;
    product.thumbnail = Array.isArray(product.thumbnail) ? product.thumbnail : [];

    const unacceptableValues = {
        title:"string",
        description: "string",
        code: "number",
        price: "number",
        status: "boolean",
        stock: "number",
        category: "string",
        thumbnail: "object",
        owner: "string",
    };

    for (const key in product) {
        if (!checkTypes(product[key], unacceptableValues[key])) {
            // Si el tipo de dato no es válido, devolver el nombre de la clave
            return { clave: key, valor: product[key] };
        }
    }

    // Si todo está bien, devolver null
    return null;
}

export function generateUniqueCode() {
    return uuidv4(); // Generar un UUID v4 como código único
}

export function validateProperties(product){
    console.log(product)
    const propiedadesPermitidas = [
        "title",
        "description",
        "code",
        "price",
        "owner",
        "status",
        "stock",
        "category",
        "thumbnail",
      
    ];
    let propiedadesQueLlegan = Object.keys(product);
    let valido = propiedadesQueLlegan.every((propiedad) =>
        propiedadesPermitidas.includes(propiedad)
    );
    return valido
}

