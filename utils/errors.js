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