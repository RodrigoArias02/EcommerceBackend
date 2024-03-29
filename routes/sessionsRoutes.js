import express from "express";
import passport from "passport";
import { UsersControllers } from "../controllers/usuarios.controllers.js";
const router = express();

router.get('/errorLogin', UsersControllers.errorLogin)
router.get("/errorRegistro", UsersControllers.errorRegister)
router.get('/errorGithub', UsersControllers.errorGithub);
//Luego cambiar current por login ↓↓↓

router.post("/current", passport.authenticate('login', {failureRedirect:'/api/sessions/errorLogin'}), UsersControllers.authenticateUser);

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), UsersControllers.authenticateUserGithub);

router.post("/registro", passport.authenticate('registro', {failureRedirect:'/api/sessions/errorRegistro'}), UsersControllers.authenticateRegisterUser);

router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get("/logout", UsersControllers.logout);

router.post("/recupero01", UsersControllers.recoverEmail)

router.get("/recupero02", UsersControllers.recoverEmail02)

router.post("/recupero03", UsersControllers.recoverEmail03)

router.put("/premium/:uid", UsersControllers.updateRol);

export default router;
