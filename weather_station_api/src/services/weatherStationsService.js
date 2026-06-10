const fileService = require('./fileService');

// Переменная для хранения пути к файлу данных
let dataFilePath;

/**
 * Инициализация сервиса с путем к файлу данных
 */
const init = (filePath) => {
    dataFilePath = filePath;
};

/**
 * Получение всех метеостанций с фильтрацией по названию
 * @param {string} name - фильтр по названию (опционально)
 * @returns {Array} массив метеостанций
 */
const findAll = (name) => {
    const weatherStations = fileService.readData(dataFilePath);
    if (name) {
        return weatherStations.filter(ws => 
            ws.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    return weatherStations;
};

/**
 * Получение метеостанции по ID
 * @param {number} id - идентификатор метеостанции
 * @returns {Object|null} метеостанция или null
 */
const findOne = (id) => {
    const weatherStations = fileService.readData(dataFilePath);
    return weatherStations.find(ws => ws.id === id) || null;
};

/**
 * Создание новой метеостанции
 * @param {Object} weatherStationData - данные новой метеостанции
 * @returns {Object} созданная метеостанция
 */
const create = (weatherStationData) => {
    const weatherStations = fileService.readData(dataFilePath);
    
    // Генерация нового ID
    const newId = weatherStations.length > 0 
        ? Math.max(...weatherStations.map(ws => ws.id)) + 1 
        : 1;
    
    const newWeatherStation = { 
        id: newId, 
        ...weatherStationData,
        lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    
    weatherStations.push(newWeatherStation);
    fileService.writeData(dataFilePath, weatherStations);
    
    return newWeatherStation;
};

/**
 * Обновление метеостанции по ID
 * @param {number} id - идентификатор метеостанции
 * @param {Object} weatherStationData - новые данные
 * @returns {Object|null} обновленная метеостанция или null
 */
const update = (id, weatherStationData) => {
    const weatherStations = fileService.readData(dataFilePath);
    const index = weatherStations.findIndex(ws => ws.id === id);
    
    if (index === -1) return null;
    
    weatherStations[index] = { 
        ...weatherStations[index], 
        ...weatherStationData,
        lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    
    fileService.writeData(dataFilePath, weatherStations);
    
    return weatherStations[index];
};

/**
 * Удаление метеостанции по ID
 * @param {number} id - идентификатор метеостанции
 * @returns {boolean} успешность удаления
 */
const remove = (id) => {
    const weatherStations = fileService.readData(dataFilePath);
    const filteredWeatherStations = weatherStations.filter(ws => ws.id !== id);
    
    if (filteredWeatherStations.length === weatherStations.length) {
        return false; // Ничего не удалили
    }
    
    fileService.writeData(dataFilePath, filteredWeatherStations);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };