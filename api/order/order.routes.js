const express = require('express');
// const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { updateOrder, addOrder, getOrders, deleteOrder } = require('./order.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOrders);
router.post('/', addOrder)
// router.put('/', requireAuth, updateOrder);
router.put('/', updateOrder);
// router.delete('/:id', requireAuth, deleteOrder)
router.delete('/:id', deleteOrder)


module.exports = router;
