export const errorArgumentos=(valido,{ ...otros})=>{
    return `
Error en Propiedades:
Validacion en propiedades:
    - validacion: esperado true, recibido ${valido}   
propiedades validas:
"title","description","code","price","status","stock","category","thumbnail"
-recibidos ${JSON.stringify(otros)}

`
}
export const errorId=(valido,id)=>{
    return `
Error en el id:
Validacion de id:
    - validacion: se espera true, recibido ${valido}   
Ids validos:
    -se espera un id tipo mongo ejemplo:"5f7a1e4c85b84b37c905c4d2"
-recibido: "${id}"

`
}


export const errorTipoValores=(object)=>{
    return `
    Error en tipo de datos:
    Validacion en valores:
        - validacion: esperado null, recibido ${JSON.stringify(object)}
    valores aceptados segun las claves:
        - title: ["string"],
        - description: ["string"],
        - code: ["number"],
        - price: ["number"],
        - status: ["boolean"],
        - stock: ["number"],
        - category: ["string"],
        - thumbnail: ["object", "array"] 
    -recibidos ${JSON.stringify(object)}
        - El valor obtenido en la clave "${object.clave}" es tipo:"${typeof(object.valor)}"
    
    `
}

export const errorTokenExpiro=()=>{
    return window.location.href = 'http://localhost:3000/recupero01?error=El token expiro!!!';
}
export const errorPeticion=(object)=>{
    return `
    Error en peticion:
    Validacion en valores:
        - Error:  ${object.error}
    Mensaje:
        -${object.messageError}
    `
}