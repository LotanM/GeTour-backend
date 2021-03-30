const express = require('express');
const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const {
    addTour,
    getTours,
    getTour,
    deleteTour,
    updateTour,
} = require('./tour.controller');
const router = express.Router();


router.get('/', getTours);
// router.post('/', requireAuth, addTour)
router.post('/', addTour)
router.get('/:id', getTour);
router.put('/:id', updateTour);
// router.delete('/:id', requireAuth, deleteTour)
router.delete('/:id', deleteTour)

module.exports = router;
