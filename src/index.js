const express = require('express');
const cors = require('cors');
const path = require('path');
const stationsRouter = require('./routes/stations');
const stationsService = require('./services/stationsService');

const app = express();
const PORT = 3001;

const DATA_FILE_PATH = path.join(__dirname, 'data/stations.json');
stationsService.init(DATA_FILE_PATH);

// Middleware
app.use(cors());
app.use(express.json());

// Логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Главная страница API
app.get('/', (req, res) => {
    res.json({
        name: 'Meteo Stations API',
        version: '1.0.0',
        endpoints: {
            'GET /stations': 'Получить все станции (фильтр: ?name=...)',
            'GET /stations/:id': 'Получить станцию по ID',
            'POST /stations': 'Создать новую станцию',
            'PATCH /stations/:id': 'Обновить станцию',
            'DELETE /stations/:id': 'Удалить станцию'
        }
    });
});

// Маршруты
app.use('/stations', stationsRouter);

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════╗
    ║     🌤️  Meteo Stations API Server                    ║
    ╠══════════════════════════════════════════════════════╣
    ║  Сервер запущен: http://localhost:${PORT}              ║
    ║  API доступен: http://localhost:${PORT}/stations       ║
    ╚══════════════════════════════════════════════════════╝
    `);
});