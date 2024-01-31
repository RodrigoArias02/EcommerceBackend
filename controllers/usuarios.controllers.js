export class UsersControllers {
  static async renderLoginUser(req, res) {
    res.setHeader("Content-Type", "text/html");

    const { user, error } = req.query;

    res.status(200).render("login", { user, error, login: false });
  }

  static async renderRegisterUser(req, res) {
    res.setHeader("Content-Type", "text/html");
    const { error } = req.query;

    res.status(200).render("register", { error, login: false });
  }

  //autenticacion normal
  static async authenticateUser(req, res) {
    res.setHeader("Content-Type", "application/json");
    req.session.usuario = {
      nombre: req.user.first_name,
      apellido: req.user.last_name,
      carrito: req.user.cartId,
      age: req.user.age,
      email: req.user.email,
      rol: req.user.rol,
    };
    res.redirect("/productos");
  }
  //autenticacion github
  static async authenticateUserGithub(req, res) {
    req.session.usuario = {
      nombre: req.user.first_name,
      apellido: req.user.last_name,
      carrito: req.user.cartId,
      age: req.user.age,
      email: req.user.email,
      rol: req.user.rol,
    };
    res.setHeader("Content-Type", "application/json");
    res.redirect("/productos");
  }

  //autenticacion de registro
  static async authenticateRegisterUser(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { email } = req.body;
    res.redirect(`/login?user=${email}`);
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

  //errores
  static async errorLogin(req, res) {
    return res.redirect("/login?error=Credenciales incorrectas");
  }
  static async errorRegister(req, res) {
    return res.redirect("/registro?error=error al registrarse");
  }

  static async errorGithub(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      error: "Error al autenticar con Github",
    });
  }
}