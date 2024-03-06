const socket=io( )
let div = document.getElementById("productContainer")
let btnEnviarId = document.getElementById("enviarId")

function renderProducts(datos){
  let html = '';

  // Usando Array.map para transformar el array en el formato deseado
  datos.forEach(product => {
    html += `
      <div>
        <p><b>id:</b>${product._id}</p>
        <p><b>Titulo: </b>${product.title}</p>
        <p>$${product.price}</p>
        <p><b>Descripcion: </b>${product.description}</p>
        <p><b>Stock: </b>${product.stock}</p>
        <p><b>Category: </b>${product.category}</p>
        <img src=${product.thumbnail} width="400px" alt="">
      </div>
      <hr/>
    `;
  });

  div.innerHTML=html
}
//funcion que hace un fetch tipo get para pedir los productos
async function obtenerProductos() {
  try {
    // Supongamos que tienes una ruta en tu servidor que maneja la lógica para obtener productos
    const url = '/api/products';

    //solicitud GET al servidor y esperar la respuesta
    const response = await fetch(url);

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al realizar la solicitud: ${response.status}`);
    }

    // Parsea la respuesta como JSON
    const data = await response.json();
    //retorno datos
    return data

  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

btnEnviarId.addEventListener('click', async ()=>{
  const id = document.getElementsByName('id')[0].value;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
      
        },
        
      });

      console.log(response)
      if (!response.ok) {
        console.log(response.status)
        console.log(response.url)
        if(response.status==403){
          return window.location.href = "http://localhost:3000/ingresarProductos?error=El elemento que desea eliminar no es tuyo"
        }
        const data = await response.json();
        alert(data.message)

      }
  
      const data = await response.json();
      console.log(data)
      if(data.status==201){
        alert("eliminado con exito")
       
        //emitimos el nuevo array al servidor
        socket.emit('eliminado', "elementos eliminados");       
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
})


//el cliente escuchara y renderizara cada vez que llegue un nuevo array
socket.on("productos", async datos=>{
    renderProducts(datos)
   
})
socket.on("eliminado", async datos=>{
  renderProducts(datos)
 
})




