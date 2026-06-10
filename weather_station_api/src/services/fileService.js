const fs = require('fs');

/**
 * Сервис для работы с файловой системой
 * Обеспечивает чтение и запись данных в JSON файл
 */

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = {
    readData,
    writeData
};