const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('tour')
        // const tours = await collection.find(criteria).toArray()
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
        console.log(tours);
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
        // return await collection.deleteOne({ _id: ObjectId(tourId), byUserId: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove tour ${tourId}`, err)
        throw err
    }
}


async function add(tour) {
    try {
        // peek only updatable fields!

        // const tourToAdd = {
        //     byUserId: ObjectId(tour.byUserId),
        //     aboutUserId: ObjectId(tour.aboutUserId),
        //     txt: tour.txt
        // }

        const tourToAdd = {
            title: tour.title,
            capacity: tour.capacity,
            countrt: tour.country,
            price: tour.price,
            daysCount: tour.daysCount,
            difficulty: tour.difficulty,
            description: tour.description,
            tags: tour.tags,
            imgUrl: tour.imgUrl,
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
    add
}


