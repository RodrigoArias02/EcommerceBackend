import express from "express";
import passport from "passport";
const router = express();

router.get('/errorLogin', (req,res)=>{
    return res.redirect("/login?error=error al registrarse")
})
router.post("/login", passport.authenticate('login', {failureRedirect:'/api/sessions/errorLogin'}) ,async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    // const {email,password}=req.body

    // const userLog=await manager.logIn(email,password)
    // if(!userLog.user){
    //     res.redirect("/login?error=error de credenciales")
    //     return
    // }
    // if(userLog.status==500){
    //     res.redirect(`/login?error=${userLog.error}`)
    //     return
    // }
    console.log(req.user)
    req.session.usuario={
        nombre:req.user.nombre,
        email:req.user.email,
        rol:req.user.rol
    }
  res.redirect('/productos')
});

router.get("/errorRegistro", (req,res)=>{
    return res.redirect("/registro?error=error al registrarse")
})
router.post("/registro", passport.authenticate('registro', {failureRedirect:'/api/sessions/errorRegistro'}), async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const {email}=req.body

    // if(!nombre || !email || !password){
    //     res.redirect("/registro?error=Complete todos los campos")
    //     return
    // }
    // const existe= await manager.userEmail(email)
    // if (existe.status!=200) {
    //     res.redirect("/registro?error=El email ya existe");
    //     return;
    //   }
    // const usuario=await manager.aggregateUsers(nombre,email,password)
    // if(usuario.status==201){
    //     res.redirect(`/login?user=${usuario.user.email}`);
    //     return;
    // }
    res.redirect(`/login?user=${email}`);
 
});

router.get('/github', passport.authenticate('github',{}), (req,res)=>{

})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    console.log(req.user)
    req.session.usuario={
        nombre:req.user.nombre,
        email:req.user.email,
        rol:req.user.rol
    }
    console.log("______")
    console.log("______")
    res.setHeader('Content-Type','application/json');
    res.redirect('/productos')
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
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
