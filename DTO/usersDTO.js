
export class UserRead{
    constructor(usuario){
        this.nombre=usuario.first_name.toUpperCase()
        this.apellido=usuario.last_name.toUpperCase()
        this.email=usuario.email
        this.age=usuario.age
        this.carrito=usuario.cartId
        this.rol=usuario.rol

    }
}
export class UserSave{
    constructor(usuario){
        this.first_name=usuario.first_name
        this.last_name=usuario.last_name
        this.email=usuario.email
        this.age=usuario.age
        this.password=usuario.password
        this.cartId=usuario.cartId
        this.rol=usuario.rol
    }
}