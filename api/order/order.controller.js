const logger = require('../../services/logger.service');
const userService = require('../user/user.service');
const orderService = require('./order.service');

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query);
        res.send(orders);
    } catch (err) {
        logger.error('Cannot get orders', err);
        res.status(500).send({ err: 'Failed to get orders' });
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id);
        res.send({ msg: 'Deleted successfully' });
    } catch (err) {
        logger.error('Failed to delete order', err);
        res.status(500).send({ err: 'Failed to delete order' });
    }
}

async function addOrder(req, res) {
    try {
        var order = req.body;
        if (req.session.user) {
            let { _id, fullname, imgUrl } = req.session.user
            order.buyer = { _id, fullname, imgUrl }
        }
        console.log(order, 'Before Service');
        order = await orderService.add(order);
        console.log(order, 'AFTER Service');
        res.send(order);
    } catch (err) {
        logger.error('Failed to add order', err);
        res.status(500).send({ err: 'Failed to add order' });
    }
}

module.exports = {
    getOrders,
    deleteOrder,
    addOrder,
};
