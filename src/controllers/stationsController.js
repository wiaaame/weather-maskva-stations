const stationsService = require('../services/stationsService');

const getAllStations = (req, res) => {
    const { name } = req.query;
    const stations = stationsService.findAll(name);
    res.json({ success: true, count: stations.length, data: stations });
};

const getStationById = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Некорректный ID' });
    }
    const station = stationsService.findOne(id);
    if (!station) {
        return res.status(404).json({ success: false, error: `Станция с ID ${id} не найдена` });
    }
    res.json({ success: true, data: station });
};

const createStation = (req, res) => {
    const { name, temp, humidity, pressure, params, src, description } = req.body;
    if (!name || !temp || !humidity || !pressure) {
        return res.status(400).json({ 
            success: false, 
            error: 'Обязательные поля: name, temp, humidity, pressure' 
        });
    }
    const newStation = stationsService.create({ name, temp, humidity, pressure, params, src, description });
    res.status(201).json({ success: true, data: newStation });
};

const updateStation = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Некорректный ID' });
    }
    const updatedStation = stationsService.update(id, req.body);
    if (!updatedStation) {
        return res.status(404).json({ success: false, error: `Станция с ID ${id} не найдена` });
    }
    res.json({ success: true, data: updatedStation });
};

const deleteStation = (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, error: 'Некорректный ID' });
    }
    const success = stationsService.remove(id);
    if (!success) {
        return res.status(404).json({ success: false, error: `Станция с ID ${id} не найдена` });
    }
    res.status(204).send();
};

module.exports = { getAllStations, getStationById, createStation, updateStation, deleteStation };