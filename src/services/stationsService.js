const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (name) => {
    const stations = fileService.readData(dataFilePath);
    if (name) {
        return stations.filter(station => 
            station.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    return stations;
};

const findOne = (id) => {
    const stations = fileService.readData(dataFilePath);
    return stations.find(station => station.id === id) || null;
};

const create = (stationData) => {
    const stations = fileService.readData(dataFilePath);
    const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
    const newStation = {
        id: newId,
        ...stationData,
        lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    stations.push(newStation);
    fileService.writeData(dataFilePath, stations);
    return newStation;
};

const update = (id, stationData) => {
    const stations = fileService.readData(dataFilePath);
    const index = stations.findIndex(s => s.id === id);
    if (index === -1) return null;
    stations[index] = { ...stations[index], ...stationData, id: id, lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
    fileService.writeData(dataFilePath, stations);
    return stations[index];
};

const remove = (id) => {
    const stations = fileService.readData(dataFilePath);
    const filteredStations = stations.filter(s => s.id !== id);
    if (filteredStations.length === stations.length) return false;
    fileService.writeData(dataFilePath, filteredStations);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };