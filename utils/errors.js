export const errorArgumentos=({name, ...otros})=>{
    return `
Error en argumentos:
Argumentos obligatorios:
    - name: esperado tipo string, recibido ${name}   
Argumentos opcionales:
    - powers, alias, team, publisher, recibidos ${JSON.stringify(otros)}

`

}