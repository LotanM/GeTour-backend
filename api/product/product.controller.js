const logger = require('../../services/logger.service');
// const userService = require('../user/user.service');
const productService = require('./product.service');

async function getProducts(req, res) {
    try {
        const products = await productService.query(req.query);
        console.log('products:', products)
        res.send(products);
    } catch (err) {
        logger.error('Cannot get products', err);
        res.status(500).send({ err: 'Failed to get products' });
    }
}

async function getProduct(req, res) {
    try {
        const product = await productService.getById(req.params.id);
        res.send(product);
    } catch (err) {
        logger.error('Failed to get product', err);
        res.status(500).send({ err: 'Failed to get product' });
    }
}
async function deleteProduct(req, res) {
    try {
        await productService.remove(req.params.id);
        res.send({ msg: 'Deleted successfully' });
    } catch (err) {
        logger.error('Failed to delete product', err);
        res.status(500).send({ err: 'Failed to delete product' });
    }
}
async function addProduct(req, res) {
    try {
        var product = req.body;
        let { fullname, _id, imgUrl } = req.session.user;
        product.byUser = { fullname, _id, imgUrl };
        product = await productService.add(product);
        res.send(product);
    } catch (err) {
        logger.error('Failed to add product', err);
        res.status(500).send({ err: 'Failed to add product' });
    }
}

async function updateProduct(req, res) {
    try {
        const product = req.body;
        const savedProduct = await productService.update(product);
        res.send(savedProduct);
    } catch (err) {
        console.log('err:', err);
    }
}
module.exports = {
    getProducts,
    deleteProduct,
    addProduct,
    getProduct,
    updateProduct
};
