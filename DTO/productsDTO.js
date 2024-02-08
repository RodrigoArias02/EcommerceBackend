export class ProductRead{
    constructor(product){
        this.title=product.title
        this.description=product.description
        this.code=product.code
        this.price=product.price
        this.status=product.status
        this.stock=product.stock
        this.category=product.category
        this.thumbnail=product.thumbnail
    }
}
export class ProductSave{
    constructor(product){
        this.first_name=product.first_name
        this.last_name=product.last_name
        this.email=product.email
        this.age=product.age
        this.password=product.password
        this.cartId=product.cartId
        this.rol=product.rol
    }
}