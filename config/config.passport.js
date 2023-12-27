import passport from "passport";
import local from "passport-local";
import UsuariosModelo from "../dao/models/usuario.modelo.js";
import { crearHash, validPassword } from "../utils.js";
import github from "passport-github2";

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
          const { nombre } = req.body;

          if (!nombre || !username || !password) {
            console.log("Rellenar campos");
            return done(null, false);
          }

          const existe = await UsuariosModelo.findOne({ email: username });

          if (existe != null) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          let usuario;

          try {
            let passwordHash = crearHash(password);

            usuario = await UsuariosModelo.create({
              nombre,
              email: username,
              password: passwordHash,
            });

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

          let usuario = await UsuariosModelo.findOne({
            email: username,
          }).lean();
          if (!usuario) {
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }
          if (!validPassword(usuario, password)) {
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }
          if (usuario.email == "adminCoder@coder.com") {
            usuario = { ...usuario, rol: "admin" };
          } else {
            usuario = { ...usuario, rol: "usuario" };
          }
          console.log(Object.keys(usuario));
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
        clientID: "Iv1.e2121a1b68e0431d",
        clientSecret: "91b686373b760938c6f811612f7dd52d4ebc3d82",
        callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // console.log(profile)
          let usuario = await UsuariosModelo.findOne({
            email: profile._json.email,
          }).lean();
          if (!usuario) {
            let nuevoUsuario = {
              nombre: profile._json.name,
              email: profile._json.email,
              profile,
            };
            usuario = await UsuariosModelo.create(nuevoUsuario);
          }
          if (usuario.email == "adminCoder@coder.com") {
            usuario = { ...usuario, rol: "admin" };
          } else {
            usuario = { ...usuario, rol: "usuario" };
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
      const usuario = await UsuariosModelo.findOne({ email });
      return done(null, usuario);
    } catch (error) {
      done(error);
    }
  });
};
