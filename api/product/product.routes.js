const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const {
    addProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
} = require('./product.controller');
const router = express.Router();


router.get('/', getProducts);
router.post('/', addProduct)
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct)

module.exports = router;
