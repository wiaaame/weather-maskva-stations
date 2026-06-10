const express = require('express');
const cors = require('cors');
const path = require('path');
const weatherStationsRouter = require('./routes/weather_stations');
const weatherStationsService = require('./services/weatherStationsService');

const app = express();
const PORT = 3000;

// Определяем путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/weather_stations.json');

// Инициализируем сервис с путем к файлу данных
weatherStationsService.init(DATA_FILE_PATH);

// 1. Встроенный middleware для парсинга JSON
app.use(cors()); 
app.use(express.json());

// 2. Логирующий middleware (для отслеживания запросов)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 3. Подключение маршрутов
app.use('/weather_stations', weatherStationsRouter);

// 4. Глобальная обработка 404 (маршрут не найден)
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Маршрут не найден',
        message: `Маршрут ${req.method} ${req.url} не существует`
    });
});

// 5. Error handler (обработка ошибок сервера)
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        message: err.message 
    });
});

// 6. Запуск сервера
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║     🚀 Сервер метеостанций Москвы успешно запущен!           ║
    ╠══════════════════════════════════════════════════════════════╣
    ║  📍 Адрес: http://localhost:${PORT}                            ║
    ║  📡 API:   http://localhost:${PORT}/weather_stations          ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
});