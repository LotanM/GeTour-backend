const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('tour')
       
        const tours = await collection.find({}).toArray()
        console.log('tours:', tours)
        
        // var tours = await collection.aggregate([
        //     {
        //         $match: filterBy
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()
        // tours = tours.map(tour => {
        //     tour.byUser = { _id: tour.byUser._id, fullname: tour.byUser.fullname }
        //     tour.aboutUser = { _id: tour.aboutUser._id, fullname: tour.aboutUser.fullname }
        //     delete tour.byUserId
        //     delete tour.aboutUserId
        //     return tour
        // })
        return tours
    } catch (err) {
        logger.error('cannot find tours', err)
        throw err
    }

}

async function remove(tourId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('tour')
        // remove only if user is owner/admin
        const query = { _id: ObjectId(tourId) }
        if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
    } catch (err) {
        logger.error(`cannot remove tour ${tourId}`, err)
        throw err
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


async function add(tour) {
    try {
        const tourToAdd = {
            title: tour.title,
            capacity: tour.capacity,
            countrt: tour.country,
            price: tour.price,
            daysCount: tour.daysCount,
            difficulty: tour.difficulty,
            description: tour.description,
            tags: tour.tags,
            imgs: tour.imgs,
            locs: tour.locs,
        }
        const collection = await dbService.getCollection('tour')
        await collection.insertOne(tourToAdd)
        return tourToAdd;
    } catch (err) {
        logger.error('cannot insert tour', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    getByTourname,
    getById
}


