import express from "express";
import passport from "passport";
const router = express();

router.get('/errorLogin', (req,res)=>{
    return res.redirect("/login?error=Credenciales incorrectas")
})

//Luego cambiar a login ↓↓↓
router.post("/current", passport.authenticate('login', {failureRedirect:'/api/sessions/errorLogin'}) ,async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    req.session.usuario={
        nombre:req.user.first_name,
        apellido:req.user.last_name,
        carrito:req.user.cartId,
        age:req.user.age,
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
    res.redirect(`/login?user=${email}`);
 
});

router.get('/github', passport.authenticate('github',{}), (req,res)=>{

})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    req.session.usuario={
        nombre:req.user.first_name,
        apellido:req.user.last_name,
        carrito:req.user.cartId,
        age:req.user.age,
        email:req.user.email,
        rol:req.user.rol
    }
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
