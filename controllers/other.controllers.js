import moment from "moment";
import { ManagerChatMongoDB } from "../dao/managerChatMongo.js"
import { io } from "../app.js";
const manager = new ManagerChatMongoDB();

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
          let messages = await manager.loadChat();
       
        
          // Formatear la hora de cada mensaje antes de pasarlos a la plantilla
          messages = formatearHora(messages);
          res.setHeader("Content-Type", "text/html");
          res.status(200).render("chat", { messages, usuario});
        } catch (error) {
          console.error("Error al cargar el chat:", error);
          res.status(500).send("Error interno del servidor");
        }
      }

      static async renderProfile(req,res){
        res.setHeader("Content-Type", "text/html");
        const usuario = req.session.usuario;
        res.status(200).render("perfil", {usuario,login:true});
      }


      static async postChatSendMessage(req, res) {
        res.setHeader("Content-Type", "application/json");
      
        const checkTypes = (value, type) => typeof value === type;
        let { user, message } = req.body;
      
        let OK = checkTypes(user, "string") && checkTypes(message, "string");
      
        if (OK) {
          const estado = await manager.saveMessages(user, message);
          const time = moment().format("HH:mm"); // Mover la declaración de 'time' aquí
      
          if (estado.status === 201) {
            io.emit("nuevoMensaje", user, message, time);
            return res.status(201).json(estado);
          } else {
            return res.status(estado.status).json(estado);
          }
        } else {
          return res
            .status(400)
            .json({ error: "El valor de algunos de los campos no es admitido" });
        }
      }
}