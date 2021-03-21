const express = require('express')
const {requireAuth} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addTour, getTours, deleteTour} = require('./tour.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getTours)
router.post('/',  requireAuth, addTour)
router.delete('/:id',  requireAuth, deleteTour)

module.exports = router