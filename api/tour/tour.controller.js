const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const tourService = require('./tour.service')

async function getTours(req, res) {
    try {
        const tours = await tourService.query(req.query)
        res.send(tours)
    } catch (err) {
        logger.error('Cannot get tours', err)
        res.status(500).send({ err: 'Failed to get tours' })
    }
}

async function deleteTour(req, res) {
    try {
        await tourService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete tour', err)
        res.status(500).send({ err: 'Failed to delete tour' })
    }
}


async function addTour(req, res) {
    try {
        var tour = req.body
        tour.byUserId = req.session.user._id
        tour = await tourService.add(tour)
        tour.byUser = req.session.user
        tour.aboutUser = await userService.getById(tour.aboutUserId)
        res.send(tour)

    } catch (err) {
        logger.error('Failed to add tour', err)
        res.status(500).send({ err: 'Failed to add tour' })
    }
}

module.exports = {
    getTours,
    deleteTour,
    addTour
}