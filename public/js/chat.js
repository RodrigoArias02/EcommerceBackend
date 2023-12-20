const socket = io();
//mejor practica que recorrer un array.
let contenedor = document.getElementById("contenedorMensaje");
contenedor.scrollTop = contenedor.scrollHeight;
let userGlobal;
// contenedor.scrollTop = contenedor.scrollHeight;
let btn = document.getElementById("btnForm");
// Define una función asíncrona que muestra un cuadro de diálogo con un input
async function mostrarCuadroDialogo() {
  try {
    // Obtener el contenido de la etiqueta <p> por su ID
    let etiquetaP = document.getElementById("nombreUsuario").innerText;

    // Buscar y extraer el nombre de usuario del texto
    let nombreUsuario = etiquetaP.match(/user: (.+)/);

    if (nombreUsuario && nombreUsuario.length > 1) {
      let nombreUsuarioExtraido = nombreUsuario[1];
      if (nombreUsuarioExtraido) {
        await Swal.fire({
          title: "¡Hola!",
          text: "Bienvenido " + nombreUsuarioExtraido,
          icon: "success",
        });
        userGlobal = nombreUsuarioExtraido;
      }
    } else {
      await Swal.fire("Cancelado", "No iniciaste sesion.", "info");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Llama a la función asíncrona
mostrarCuadroDialogo();

// Función para agregar una nueva sección al div
function agregarSeccion(user, message, time) {
  // Crear un nuevo elemento <section>
  let nuevaSeccion = document.createElement("section");

  // Crear elementos <article>, <b> y <p> con valores específicos
  let nuevoArticle = document.createElement("article");
  let horaArticle = document.createElement("article");
  let nuevoB = document.createElement("b");
  nuevoB.textContent = user + ": ";
  let nuevoP = document.createElement("p");
  nuevoP.textContent = message;
  let nuevoPHora = document.createElement("p");
  nuevoPHora.textContent = time;

  // Agregar <b> y <p> a <article>
  nuevoArticle.appendChild(nuevoB);
  nuevoArticle.appendChild(nuevoP);
  horaArticle.appendChild(nuevoPHora);

  // Agregar <article> a <section>
  nuevaSeccion.appendChild(nuevoArticle);
  nuevaSeccion.appendChild(horaArticle);

  // Agregar la nueva sección al div
  contenedor.appendChild(nuevaSeccion);
  contenedor.scrollTop = contenedor.scrollHeight;
}
btn.addEventListener("click", async () => {
  // Obtener datos del formulario
  const message = document.getElementsByName("message")[0].value;

  console.log(userGlobal);
  // Crear un objeto JSON con los datos del formulario
  const formData = {
    user: userGlobal,
    message: message,
  };
  // Enviar datos al servidor
  try {
    // Enviar datos al servidor y esperar la respuesta
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Parsear la respuesta como JSON
    const data = await response.json();

    if (data.status == "201") {
      // Obtener productos después de enviar el formulario
      console.log(data.message);
      // Emitir productos al servidor
    } else {
      console.log(data.error);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
});

socket.on("nuevoMensaje", async (user, message, time) => {
  agregarSeccion(user, message, time);
});
