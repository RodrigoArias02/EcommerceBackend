import { fakerES_MX as faker } from "@faker-js/faker";

export const generarProductos = () => {

    let productos=[]
    for (let i = 0; i <100; i++){
        let title = faker.commerce.product("electrónica");

        let description = faker.commerce.productDescription();

        let code = faker.string.alphanumeric(5);

        let priceString = faker.commerce.price({min: 1000, max: 40000, dec: 2, symbol: "$",});
        let price = Number(priceString.slice(1));
        
        let status = faker.datatype.boolean(); 

        let stock=faker.number.int({min:1, max:25})

        let category = faker.commerce.department();

        let thumbnail = [];
        for (let i = 0; i < faker.number.int({min:1, max:3}); i++) {
            thumbnail.push(faker.image.url());
        }
        productos.push( { title, description, code ,price, status, stock, category,thumbnail })
    }
    return productos;
};
