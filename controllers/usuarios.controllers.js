import { UserRead } from "../DTO/usersDTO.js";
import jwt from "jsonwebtoken";
import { UserServices } from "../service/user.service.js";
import { configVar } from "../config/config.js";
import { submitEmail } from "../mails/mail.js";
import { crearHash, validPassword } from "../utils.js";
import { CustomError } from "../utils/customErrors.js";
import { errorTokenExpiro } from "../utils/errors.js";
export class UsersControllers {
  static async renderLoginUser(req, res) {
    res.setHeader("Content-Type", "text/html");
    const login = req.session.usuario ? true : false;
    const { user, error } = req.query;

    res.status(200).render("login", { user, error, login });
  }

  static async renderRegisterUser(req, res) {
    res.setHeader("Content-Type", "text/html");
    const login = req.session.usuario ? true : false;
    const { error } = req.query;

    res.status(200).render("register", { error, login });
  }

  //autenticacion normal
  static async authenticateUser(req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.isAuthenticated()) {
      let user = new UserRead(req.user);
      req.session.usuario = user;
      // return res.redirect("/productos"); //produccion
      return res.status(200).json({ message: "Autenticación exitosa", user }); //test
    } else {
      return res.status(401).json({ error: "No se pudo autenticar el usuario" });
    }
  }
  //autenticacion github
  static async authenticateUserGithub(req, res) {
    res.setHeader("Content-Type", "application/json");

    let user = req.user;

    user = new UserRead(user);

    req.session.usuario = user;

    if (req.session.usuario) {
      res.redirect("/productos");
    } else {
      return res
        .status(401)
        .json({ error: "No se consiguio iniciar la session" });
    }
  }

  //autenticacion de registro
  static async authenticateRegisterUser(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { email } = req.body;


    return res.redirect(`/login?user=${email}`);
  }

  //logout
  static async logout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        res.redirect("/login?error=fallo en el logout");
      }
    });
    res.redirect("/login");
  }

  static async recoverEmail(req, res) {
    let { email } = req.body;

    let usuario = await UserServices.getByEmail(email);
    if (!usuario) {
      return res.redirect(
        `${configVar.URL}/recupero01?error=No existe el email: ${email}`
      );
    }
    delete usuario.password;
    let token = jwt.sign({ ...usuario }, configVar.SECRETSESSION, {
      expiresIn: "1h",
    });

    let mensaje = `Hola ah solicitado reiniciar...
    Haga click en el siguiente link: <a href="${configVar.URL}/api/sessions/recupero02?token=${token}">Resetear contraseña</a>
    `;

    let respuesta = await submitEmail(email, "recupero password", mensaje);

    if (respuesta.accepted.length > 0) {
      res.redirect(
        `${configVar.URL}/recupero01?message=Recibira en breves un mensaje en su email`
      );
    } else {
      res.redirect(
        `${configVar.URL}/recupero01?error=Error al intenar recuperar la contraseña`
      );
    }
  }

  static async recoverEmail02(req, res) {
    let { token } = req.query;
    try {
      res.redirect(`${configVar.URL}/recupero02?token=${token}`);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ha ocurrido un error en el servidor" });
    }
  }

  static async recoverEmail03(req, res) {
    try {
      let { secondPassword, token } = req.body;
      let datosToken = jwt.verify(token, configVar.SECRETSESSION);
      let email = datosToken.email;
      let usuario = await UserServices.getByEmail(email);

      if (!usuario) {
        return res.redirect(
          `${configVar.URL} /recupero01?error=No se encontro el usuario`
        );
      }
      let passwordHash = crearHash(secondPassword);

      if (validPassword(usuario, secondPassword)) {
        return res.redirect(
          `${configVar.URL}/recupero02?error=La contraseña ingresada ya esta vigente, elija otra&token=${token}`
        );
      }
      let usuarioActualizado = { ...usuario, password: passwordHash };

      let respuesta = await UserServices.updateUserService(
        email,
        usuarioActualizado
      );

      if (respuesta.status != 200) {
        return res.redirect(
          `${configVar.URL}/recupero01?error=${respuesta.error}`
        );
      }

      return res.redirect(
        `${configVar.URL}/recupero01?message=Contraseña reseteada...!!!`
      );
    } catch (error) {
      if (error.expiredAt) {
        return res.redirect(
          `${configVar.URL}/recupero01?error=El token ha expirado: ${error.expiredAt}`
        );
      } else {
        return res
          .status(500)
          .json({ error: "ha ocurrido un error en el servidor" });
      }
    }
  }
  static async updateRol(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      const uid = req.params.uid;
      let rol;

      let usuario = await UserServices.searchUserIdService(uid);

      if (usuario.rol == "usuario") {
        rol = "premium";
      } else if (usuario.rol == "premium") {
        rol = "usuario";
      } else {
        return res
          .status(404)
          .json({ error: "el rol de este usuario no se puede cambiar." });
      }
      let usuarioModificado = {
        ...usuario,
        rol,
      };
      let respuesta = await UserServices.updateUserService(
        usuario.email,
        usuarioModificado
      );
      return res.status(201).json({ respuesta });
    } catch (error) {}
  }
  //errores
  static async errorLogin(req, res) {
    return res.redirect("/login?error=Credenciales incorrectas");
  }
  static async errorRegister(req, res) {
    return res.redirect("/registro?error=error al registrarse");
  }
  static async errorGithub(req, res) {
    res.setHeader("Content-Type", "application/json");
    return res.redirect("/registro?error=Usuario no registrado");
  }
}
