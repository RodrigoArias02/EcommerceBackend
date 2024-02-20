import moment from "moment";
import { io } from "../app.js";
import { ChatServices } from "../service/chat.service.js";
import { generarProductos } from "../mock.js";
function formatearHora(messages) {
  messages.map((message) => {
    message.formattedCreatedAt = moment(message.createdAt).format("HH:mm");
    return message;
  });
  return messages;
}

export class OthersControllers {
  static async renderChat(req, res) {
    try {
      const usuario = req.session.usuario;
      let messages = await ChatServices.loadChatService();

      // Formatear la hora de cada mensaje antes de pasarlos a la plantilla
      messages = formatearHora(messages);
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("chat", { messages, usuario });
    } catch (error) {
      console.error("Error al cargar el chat:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async renderProfile(req, res) {
    res.setHeader("Content-Type", "text/html");
    const { error } = req.query;
    const usuario = req.session.usuario;
    res.status(200).render("perfil", { usuario, login: true, error });
  }

  static async postChatSendMessage(req, res) {
    res.setHeader("Content-Type", "application/json");

    const checkTypes = (value, type) => typeof value === type;
    let { user, message } = req.body;

    let OK = checkTypes(user, "string") && checkTypes(message, "string");

    if (OK) {
      const estado = await ChatServices.saveMessagesService(user, message);
      const time = moment().format("HH:mm"); // Mover la declaración de 'time' aquí

      if (estado.status === 201) {
        io.emit("nuevoMensaje", user, message, time);
        return res.status(201).json(estado);
      } else {
        return res.status(estado.status).json(estado);
      }
    } else {
      return res;
      // .status(400)
      // .json({ //error: "El valor de algunos de los campos no es admitido" });
    }
  }

  static async mock(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let resultado = generarProductos();
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ha ocurrido un error en el servidor" });
    }
  }

  static async loggerTest(req, res, next) {
    try {
      res.setHeader("Content-Type", "application/json");
      req.logger.debug("Debug message");
      req.logger.http("HTTP message");
      req.logger.info("Info message");
      req.logger.warning("Warning message");
      req.logger.error("Error message");
      req.logger.fatal("Fatal message");

      return res
        .status(200)
        .send("Registros impresos, verifique la consola o errores.log");
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ha ocurrido un error en el servidor" });
    }
  }
}
