const weatherStationsService = require('../services/weatherStationsService');

/**
 * Контроллер для обработки запросов к API метеостанций
 */

/**
 * GET /weather_stations/ - получение всех метеостанций с фильтрацией
 */
const getAllWeatherStations = (req, res) => {
    const { name } = req.query;
    const weatherStations = weatherStationsService.findAll(name);
    res.status(200).json(weatherStations);
};

/**
 * GET /weather_stations/:id - получение метеостанции по ID
 */
const getWeatherStationById = (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    const weatherStation = weatherStationsService.findOne(id);
    
    if (!weatherStation) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    
    res.status(200).json(weatherStation);
};

/**
 * POST /weather_stations/ - создание новой метеостанции
 */
const createWeatherStation = (req, res) => {
    const { name, temp, humidity, pressure, src } = req.body;
    
    // Валидация обязательных полей
    if (!name || !temp || !humidity || !pressure) {
        return res.status(400).json({ 
            error: 'Не все обязательные поля заполнены',
            required: ['name', 'temp', 'humidity', 'pressure'],
            optional: ['src']
        });
    }
    
    // Валидация типов
    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Поле name должно быть строкой' });
    }
    
    // Значения по умолчанию
    const weatherStationData = {
        name,
        temp,
        humidity,
        pressure,
        src: src || 'https://picsum.photos/id/15/400/300'
    };
    
    const newWeatherStation = weatherStationsService.create(weatherStationData);
    res.status(201).json(newWeatherStation);
};

/**
 * PATCH /weather_stations/:id - обновление метеостанции
 */
const updateWeatherStation = (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    // Проверяем, существует ли метеостанция
    const existingWeatherStation = weatherStationsService.findOne(id);
    if (!existingWeatherStation) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    
    const updatedWeatherStation = weatherStationsService.update(id, req.body);
    res.status(200).json(updatedWeatherStation);
};

/**
 * DELETE /weather_stations/:id - удаление метеостанции
 */
const deleteWeatherStation = (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    const success = weatherStationsService.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    
    res.status(204).send(); // 204 No Content
};

module.exports = {
    getAllWeatherStations,
    getWeatherStationById,
    createWeatherStation,
    updateWeatherStation,
    deleteWeatherStation
};