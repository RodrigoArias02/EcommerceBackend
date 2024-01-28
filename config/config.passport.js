import passport from "passport";
import local from "passport-local";
import { ManagerUsersMongoDB } from "../dao/managerUsersMongo.js";
import { crearHash, validPassword } from "../utils.js";
import github from "passport-github2";
import { configVar } from "./config.js";

const managerUsers = new ManagerUsersMongoDB();
export const initializarPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: "email", // Aquí estás configurando que el campo de usuario es el correo electrónico
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age, cartId, rol } = req.body;

          if (
            !first_name ||
            !last_name ||
            !age ||
            !cartId ||
            !username ||
            !password
          ) {
            console.log("Rellenar campos");
            return done(null, false);
          }

          const existe = await managerUsers.searchUserEmail(username);

          if (existe != null) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          let usuario;

          try {
            let passwordHash = crearHash(password);
            usuario = await managerUsers.createUser(
              first_name,
              last_name,
              username,
              age,
              passwordHash,
              cartId,
              rol
            );
            return done(null, usuario);
          } catch (error) {
            return done(error);
          }
        } catch (error) {
          console.log("Error primer try", error);
          return done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          // let {email, password}=req.body
          if (!username || !password) {
            // return res.redirect('/login?error=Complete todos los datos')
            return done(null, false);
          }

          let usuario = await managerUsers.searchUserEmail(username);
          if (!usuario) {
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }
          if (!validPassword(usuario, password)) {
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }

          delete usuario.password;
          return done(null, usuario);
          // previo a devolver un usuario con done, passport graba en la req, una propiedad
          // user, con los datos del usuario. Luego podré hacer req.user
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: configVar.CLIENTIDGITHUB,
        clientSecret: configVar.CLIENTSECRETGITHUB,
        callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let usuario = await managerUsers.searchUserEmail(profile._json.email);
          if (!usuario) {
            let nuevoUsuario = {
              nombre: profile._json.name,
              email: profile._json.email,
              profile,
            };
            console.log("El usuario no esta registrado");
            return done(null, false);
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //configurar serializador y deserializador
  passport.serializeUser((usuario, done) => {
    return done(null, usuario.email); // Utiliza el correo electrónico como identificador único
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const usuario = await managerUsers.searchUserEmail(email);
      return done(null, usuario);
    } catch (error) {
      done(error);
    }
  });
};
