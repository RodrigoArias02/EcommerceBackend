import express from "express";
import { ManagerChatMongoDB } from "../dao/managerChatMongo.js";
import moment from "moment";
import { io } from "../app.js";

const manager = new ManagerChatMongoDB();
const router = express();

// Ruta principal
router.post("/", async (req, res) => {
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
});

export default router;
