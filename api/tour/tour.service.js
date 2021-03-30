const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const asyncLocalStorage = require('../../services/als.service');

async function query() {
    try {
        const collection = await dbService.getCollection('tour');
        const tours = await collection.find({}).toArray();
        return tours;
    } catch (err) {
        logger.error('cannot find tours', err);
        throw err;
    }
}

async function remove(tourId) {
    try {
        const collection = await dbService.getCollection('tour');
        const query = { _id: ObjectId(tourId) };
        await collection.deleteOne(query);
    } catch (err) {
        logger.error(`cannot remove tour ${tourId}`, err);
        throw err;
    }
}
async function getById(tourId) {
    try {
        const collection = await dbService.getCollection('tour');
        const tour = await collection.findOne({ _id: ObjectId(tourId) });
        return tour;
    } catch (err) {
        logger.error(`while finding tour ${tourId}`, err);
        throw err;
    }
}
async function getByTourname(tourname) {
    try {
        const collection = await dbService.getCollection('tour');
        const tour = await collection.findOne({ tourname });
        return tour;
    } catch (err) {
        logger.error(`while finding tour ${tourname}`, err);
        throw err;
    }
}

async function update(tour) {
    try {
        tour._id = ObjectId(tour._id);
        const collection = await dbService.getCollection('tour');
        await collection.updateOne({ _id: tour._id }, { $set: tour });
        return tour;
    } catch (err) {
        console.log('err:', err);
    }
}

async function add(tour) {
    try {
        const collection = await dbService.getCollection('tour');
        await collection.insertOne(tour);
        return tour;
    } catch (err) {
        logger.error('cannot insert tour', err);
        throw err;
    }
}

module.exports = {
    query,
    remove,
    update,
    add,
    getByTourname,
    getById,
};
