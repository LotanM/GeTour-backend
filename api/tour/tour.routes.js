const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addTour, getTours, deleteTour } = require('./tour.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getTours)
router.get('/', getTours)
// router.post('/',  requireAuth, addTour)
router.post('/', addTour)
// router.delete('/:id',  requireAuth, deleteTour)
router.delete('/:id', deleteTour)

module.exports = router