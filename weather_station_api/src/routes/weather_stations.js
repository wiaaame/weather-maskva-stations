const express = require('express');
const router = express.Router();
const weatherStationsController = require('../controllers/weatherStationsController');

/**
 * Маршруты для работы с метеостанциями
 * Базовый путь: /weather_stations
 */

// GET /weather_stations/ - получение всех метеостанций (с фильтрацией по name)
router.get('/', weatherStationsController.getAllWeatherStations);

// GET /weather_stations/:id - получение метеостанции по ID
router.get('/:id', weatherStationsController.getWeatherStationById);

// POST /weather_stations/ - создание новой метеостанции
router.post('/', weatherStationsController.createWeatherStation);

// PATCH /weather_stations/:id - обновление метеостанции
router.patch('/:id', weatherStationsController.updateWeatherStation);

// DELETE /weather_stations/:id - удаление метеостанции
router.delete('/:id', weatherStationsController.deleteWeatherStation);

module.exports = router;