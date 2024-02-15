import express from "express";
import mongoose from "mongoose";

import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializarPassport } from "./config/config.passport.js";
import passport from "passport";
import { configVar } from "./config/config.js";
// import ProductManager from './functions/functionProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// let ruta = join(__dirname, "archives", "products.json");

const app = express();
const PORT = configVar.PORT;

// Configuración del motor de vistas
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodssByDefault: true,
    },
  })
);

app.use(
  session({
    secret: configVar.SECRETSESSION,
    resave:true,
    saveUninitialized:true,
    store: MongoStore.create({
      mongoUrl:configVar.MONGO_URL,
      mongoOptions:{dbName:configVar.DBNAME},
      ttl:3600
    })
  })
);

app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "./public")));
initializarPassport()
app.use(passport.initialize())
app.use(passport.session())

// Rutas
import routerProducts from "./routes/productsRoutes.js";
import routerCart from "./routes/cartRoutes.js";
import routerViews from "./routes/viewsRoutes.js";
import routerChat from "./routes/chatRoutes.js";
import routerSessions from "./routes/sessionsRoutes.js";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";


app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);
app.use("/", routerViews);
app.use("/chat", routerChat);
app.use("/api/sessions", routerSessions);


app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).send("La ruta no se encontró");
});



// Iniciar servidor
let serverHttp = app.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto:", PORT);
});

export const io = new Server(serverHttp);

io.on("connection", (socket) => {
  console.log(`Se conecto el cliente ${socket.id}`);
  socket.on("producto", (datos) => {
    io.emit("NuevoProducto", datos);

    console.log("emitiendo desde el servidor:");
  });
  //escuchamos que viene el array nuevo
  socket.on("ProductoEliminado", (datos) => {
    //emitimos al cliente para que lo escuche y luego haga el render
    io.emit("nuevoProductoEliminado", datos);

    console.log("emitiendo desde el servidor:");
  });
});
try {
  await mongoose.connect(
    configVar.MONGO_URL,
    { dbName: configVar.DBNAME }
  );
  console.log("DB Online");
} catch (error) {
  console.log(error);
}
