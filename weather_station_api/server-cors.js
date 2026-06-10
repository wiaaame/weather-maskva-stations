const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'src/data/weather_stations.json');

// Чтение данных
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        const defaultData = [
            {"id":1,"name":"ВДНХ","temp":"-2.5","humidity":"78%","pressure":"1012 hPa","lastUpdate":"2026-06-07 08:00","src":"https://picsum.photos/id/15/400/300"},
            {"id":2,"name":"Балчуг","temp":"-1.8","humidity":"75%","pressure":"1013 hPa","lastUpdate":"2026-06-07 08:15","src":"https://picsum.photos/id/104/400/300"},
            {"id":3,"name":"Тушино","temp":"-3.2","humidity":"82%","pressure":"1011 hPa","lastUpdate":"2026-06-07 07:45","src":"https://picsum.photos/id/96/400/300"},
            {"id":4,"name":"МГУ","temp":"-2.1","humidity":"76%","pressure":"1012 hPa","lastUpdate":"2026-06-07 08:30","src":"https://picsum.photos/id/12/400/300"}
        ];
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
};

// Запись данных
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// GET все станции (с фильтрацией)
app.get('/weather_stations', (req, res) => {
    const { name } = req.query;
    let stations = readData();
    if (name) {
        stations = stations.filter(s => 
            s.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(stations);
});

// GET по ID
app.get('/weather_stations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const stations = readData();
    const station = stations.find(s => s.id === id);
    if (!station) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    res.json(station);
});

// POST создать
app.post('/weather_stations', (req, res) => {
    const { name, temp, humidity, pressure, src } = req.body;
    const stations = readData();
    const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
    const newStation = {
        id: newId,
        name,
        temp,
        humidity,
        pressure,
        src: src || 'https://picsum.photos/id/15/400/300',
        lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    stations.push(newStation);
    writeData(stations);
    res.status(201).json(newStation);
});

// PATCH обновить (для ЛР6)
app.patch('/weather_stations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const stations = readData();
    const index = stations.findIndex(s => s.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    stations[index] = { ...stations[index], ...req.body, lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
    writeData(stations);
    res.json(stations[index]);
});

// DELETE удалить
app.delete('/weather_stations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let stations = readData();
    const filteredStations = stations.filter(s => s.id !== id);
    
    if (filteredStations.length === stations.length) {
        return res.status(404).json({ error: 'Метеостанция не найдена' });
    }
    
    writeData(filteredStations);
    console.log(`DELETE: удалена метеостанция с id ${id}`);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`✅ Сервер с CORS запущен!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/weather_stations`);
    console.log(`========================================`);
});
