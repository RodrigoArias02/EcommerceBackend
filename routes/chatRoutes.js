import express from "express";
import { OthersControllers } from "../controllers/other.controllers.js";

const router = express();

// Ruta principal
router.post("/", OthersControllers.postChatSendMessage );


export default router;
