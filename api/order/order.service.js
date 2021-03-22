const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const asyncLocalStorage = require('../../services/als.service');
async function query() {
    try {
        const collection = await dbService.getCollection('order');
        const orders = await collection.find({}).toArray();
        return collection;
    } catch (err) {
        logger.error('cannot find orders', err);
        throw err;
    }
}

async function remove(orderId) {
    try {
        const store = asyncLocalStorage.getStore();
        const { orderId } = store;
        const collection = await dbService.getCollection('order');

        // remove only if user is owner/admin
        const query = { _id: ObjectId(orderId) };
        await collection.deleteOne(query);
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err);
        throw err;
    }
}

async function add(order) {
    try {
        const orderToAdd = {
            _id: order._id,
            byUser: order.byUser,
            createdAt: order.createdAt,
            guestesCount: order.guestesCount,
            status: order.status,
            totalPrice: order.totalPrice,
            tour: order.tour,
        };
        const collection = await dbService.getCollection('order');
        await collection.insertOne(orderToAdd);
        return orderToAdd;
    } catch (err) {
        logger.error('cannot insert order', err);
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    return criteria;
}

module.exports = {
    query,
    remove,
    add,
};
