const DBService = require('../../services/db.service');

function query() {
    var query = `SELECT * FROM product `;
    return DBService.runSQL(query);
}

async function getById(productId) {
    var query = `SELECT * FROM product WHERE product._id = ${productId}`;
    var products = await DBService.runSQL(query);
    if (products.length === 1) return products[0];
    throw new Error(`product id ${productId} not found`);
}

function add(product) {
    var query = `INSERT INTO product (name, price) 
                VALUES ("${product.name}",
                        "${product.price}",
                        `;
    return DBService.runSQL(query);
}

async function update(product) {
    console.log('product:', product);
    var query = `UPDATE product set name = "${product.name}",price= "${product.price}" WHERE product._id = ${product._id}`;
    var okPacket = await DBService.runSQL(query);
    if (okPacket.affectedRows !== 0) return okPacket;
    throw new Error(`No product updated - product id ${product._id}`);
}

function remove(productId) {
    var query = `DELETE FROM product WHERE product._id = ${productId}`;

    return DBService.runSQL(query).then((okPacket) =>
        okPacket.affectedRows === 1
            ? okPacket
            : Promise.reject(
                  new Error(`No product deleted - product id ${productId}`)
              )
    );
}

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
};
