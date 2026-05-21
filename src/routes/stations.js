const express = require('express');
const router = express.Router();
const stationsController = require('../controllers/stationsController');

router.get('/', stationsController.getAllStations);
router.get('/:id', stationsController.getStationById);
router.post('/', stationsController.createStation);
router.patch('/:id', stationsController.updateStation);
router.delete('/:id', stationsController.deleteStation);

module.exports = router;