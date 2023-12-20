import express from "express";
import { ManagerUsuarioMongoDB } from "../dao/managerSessions.js";
const router = express();

const manager = new ManagerUsuarioMongoDB();

router.post("/login", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const {email,password}=req.body

    const userLog=await manager.logIn(email,password)
    console.log(userLog)
    if(!userLog.user){
        res.redirect("/login?error=error de credenciales")
        return
    }
    if(userLog.status==500){
        res.redirect(`/login?error=${userLog.error}`)
        return
    }

    req.session.usuario={
        nombre:userLog.user.nombre,
        email:userLog.user.email,
        rol:userLog.user.rol
    }
  res.redirect('/productos')
});

router.post("/registro", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const {nombre, email, password}=req.body

    if(!nombre || !email || !password){
        res.redirect("/registro?error=Complete todos los campos")
        return
    }
    const existe= await manager.userEmail(email)
    if (existe.status!=200) {
        res.redirect("/registro?error=El email ya existe");
        return;
      }
    const usuario=await manager.aggregateUsers(nombre,email,password)
    if(usuario.status==201){
        res.redirect(`/login?user=${usuario.user.email}`);
        return;
    }
    res.status(200).json({usuario})
});

router.get("/logout", async (req, res) => {
    req.session.destroy(error=>{
        if(error){
            res.redirect("/login?error=fallo en el logout")
        }
    })
    res.redirect("/login")
});
export default router;
