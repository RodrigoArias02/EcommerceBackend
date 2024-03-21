import passport from "passport";
import local from "passport-local";
import { crearHash, validPassword } from "../utils.js";
import github from "passport-github2";
import { UserSave } from "../DTO/usersDTO.js";
import { UserServices } from "../service/user.service.js";
import { configVar } from "./config.js";
import { CartServices } from "../service/cart.service.js";

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
          let usuario = req.body;
          let obtenerCart=await CartServices.createCartService()
      
          usuario.cartId=obtenerCart.producto._id
          let {first_name,last_name,age,password} = req.body;
          if (
            !first_name ||
            !last_name ||
            !age ||
            !username ||
            !password
          ) {
            console.log("Rellenar campos");
            return done(null, false);
          }

          let existe= await UserServices.getByEmail(username)

          if (existe != null) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          existe= await UserServices.searchCartUsedService(usuario.cartId)
       
          if (existe != null) {
            console.log("El carrito ya esta en uso");
            return done(null, false);
          }
          
          let usuarioMongo;

          try {
            let passwordHash = crearHash(password);

            usuario.password=passwordHash
            usuario=new UserSave(usuario)

            usuarioMongo= await UserServices.createUserService(usuario)
            
            return done(null, usuarioMongo);
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
          if (!username || !password) {
           
            // return res.redirect('/login?error=Complete todos los datos')
            return done(null, false);
          }
          let usuario= await UserServices.getByEmail(username)
          console.log(usuario)
          if (!usuario) {
          
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }
          if (!validPassword(usuario, password)) {
           
            // return res.redirect(`/login?error=credenciales incorrectas`)
            return done(null, false);
          }

          delete usuario.password;
          if(usuario){
          return done(null, usuario);

          }else{
           
            return done(null, false);
          }
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

          let usuario= await UserServices.getByEmail(profile._json.email)
  
          if (!usuario) {
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

    if(usuario.email){
    return done(null, usuario.email); // Utiliza el correo electrónico como identificador único
    }
  });

  passport.deserializeUser(async (email, done) => {
    try {
      if(email){
      const usuario= await UserServices.getByEmail(email)
      return done(null, usuario);}
    } catch (error) {
      done(error);
    }
  });
};
