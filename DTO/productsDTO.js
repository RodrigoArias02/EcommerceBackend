export class ProductRead {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.code = Number(product.code); // Convertir a número
        this.price = Number(product.price); // Convertir a número
        this.status = (product.status === 'active'); 
        this.stock = Number(product.stock); // Convertir a número
        this.category = product.category;
        this.thumbnail = [product.thumbnail];
        this.owner = product.owner;
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