import { ProductCardComponent } from "../../components/product-card/index.js";
import { ButtonHome } from "../../components/button-home/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filterText = "";
        // Данные хранятся здесь
        this.stations = [
            {
                id: 1,
                name: "ВДНХ",
                temp: "-2.5",
                humidity: "78%",
                pressure: "1012 hPa",
                params: "температура, влажность, давление",
                lastUpdate: "2026-04-22 08:00",
                src: "https://avatars.mds.yandex.net/get-vertis-journal/4469561/evgen-slavin-jpDfWBvuAmI-unsplash.jpg_1755252021364/1600x1600"
            },
            {
                id: 2,
                name: "Балчуг",
                temp: "-1.8",
                humidity: "75%",
                pressure: "1013 hPa",
                params: "температура, влажность, давление, ветер",
                lastUpdate: "2026-04-22 08:15",
                src: "https://avatars.mds.yandex.net/i?id=e5eedb886d58377186ba42eb718b824b23a97f11-12488046-images-thumbs&n=13"
            },
            {
                id: 3,
                name: "Тушино",
                temp: "-3.2",
                humidity: "82%",
                pressure: "1011 hPa",
                params: "температура, влажность",
                lastUpdate: "2026-04-22 07:45",
                src: "https://fb.ru/misc/i/gallery/39254/2404881.jpg"
            },
            {
                id: 4,
                name: "МГУ",
                temp: "-2.1",
                humidity: "76%",
                pressure: "1012 hPa",
                params: "температура, влажность, давление, осадки",
                lastUpdate: "2026-04-22 08:30",
                src: "https://avatars.mds.yandex.net/i?id=769fa5410c4144c9a48099874a35a022a67584bf-9266849-images-thumbs&n=13"
            }
        ];
    }


    // ЗАДАЧА 3.1: Функция объединения объектов (merge)
    mergeObjects(...objects) {
        const result = {};
        let objIndex = 0;
        do {
            const currentObj = objects[objIndex];
            if (currentObj && typeof currentObj === 'object') {
                const keys = Object.keys(currentObj);
                let keyIndex = 0;
                do {
                    const key = keys[keyIndex];
                    if (!(key in result)) {
                        result[key] = currentObj[key];
                    }
                    keyIndex++;
                } while (keyIndex < keys.length);
            }
            objIndex++;
        } while (objIndex < objects.length);
        return result;
    }

    // ЗАДАЧА 2.12: Функция сравнения значений (isEqual)
    isEqual(valueA, valueB) {
        if (Object.is(valueA, valueB)) return true;
        
        const typeA = typeof valueA;
        const typeB = typeof valueB;
        if (typeA !== typeB) return false;
        
        if (valueA === null || valueB === null) return false;
        
        const isArrayA = Array.isArray(valueA);
        const isArrayB = Array.isArray(valueB);
        if (isArrayA !== isArrayB) return false;
        
        if (isArrayA && isArrayB) {
            if (valueA.length !== valueB.length) return false;
            let index = 0;
            do {
                if (!this.isEqual(valueA[index], valueB[index])) return false;
                index++;
            } while (index < valueA.length);
            return true;
        }
        
        if (typeA === 'object' && typeB === 'object') {
            const keysA = Object.keys(valueA);
            const keysB = Object.keys(valueB);
            if (keysA.length !== keysB.length) return false;
            
            let i = 0;
            do {
                const key = keysA[i];
                if (!keysB.includes(key)) return false;
                if (!this.isEqual(valueA[key], valueB[key])) return false;
                i++;
            } while (i < keysA.length);
            return true;
        }
        
        return false;
    }

    showMergeResult() {
        const stationData = {
            total: this.stations.length,
            updated: new Date().toLocaleTimeString()
        };
        
        const weatherData = {
            avgTemp: (this.stations.reduce((sum, s) => sum + parseFloat(s.temp), 0) / this.stations.length).toFixed(1),
            minTemp: Math.min(...this.stations.map(s => parseFloat(s.temp))),
            maxTemp: Math.max(...this.stations.map(s => parseFloat(s.temp)))
        };
        
        const systemData = {
            status: "Активен",
            source: "Росгидромет"
        };
        
        const mergedInfo = this.mergeObjects(stationData, weatherData, systemData);
        
        const resultDiv = document.getElementById('merge-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <span class="result-icon">📊</span>
                        <span class="result-title">Сводка метеоданных</span>
                        <button class="close-btn" onclick="this.closest('.result-card').remove()">✕</button>
                    </div>
                    <div class="result-content">
                        <div class="result-item">
                            <span class="result-label">Всего станций:</span>
                            <span class="result-value">${mergedInfo.total}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Средняя температура:</span>
                            <span class="result-value">${mergedInfo.avgTemp}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Мин/Макс температура:</span>
                            <span class="result-value">${mergedInfo.minTemp}°C / ${mergedInfo.maxTemp}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Источник данных:</span>
                            <span class="result-value">${mergedInfo.source}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Статус:</span>
                            <span class="result-value status-active">${mergedInfo.status}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Обновлено:</span>
                            <span class="result-value">${mergedInfo.updated}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showCompareResult() {
        const stationVDNKh = { name: "ВДНХ", temp: "-2.5", humidity: "78%", pressure: "1012 hPa" };
        const stationVDNKhCopy = { name: "ВДНХ", temp: "-2.5", humidity: "78%", pressure: "1012 hPa" };
        const stationBalchug = { name: "Балчуг", temp: "-1.8", humidity: "75%", pressure: "1013 hPa" };
        
        const arrayParamsVDNKh = ["температура", "влажность", "давление"];
        const arrayParamsVDNKhCopy = ["температура", "влажность", "давление"];
        const arrayParamsTushino = ["температура", "влажность"];
        
        const compareStations = this.isEqual(stationVDNKh, stationVDNKhCopy);
        const compareDifferent = this.isEqual(stationVDNKh, stationBalchug);
        const compareArrays = this.isEqual(arrayParamsVDNKh, arrayParamsVDNKhCopy);
        const compareArraysDiff = this.isEqual(arrayParamsVDNKh, arrayParamsTushino);
        
        const resultDiv = document.getElementById('compare-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <span class="result-icon">🔍</span>
                        <span class="result-title">Сравнение метеостанций</span>
                        <button class="close-btn" onclick="this.closest('.result-card').remove()">✕</button>
                    </div>
                    <div class="result-content">
                        <div class="compare-item">
                            <div class="compare-label">ВДНХ = ВДНХ</div>
                            <div class="compare-result ${compareStations ? 'result-true' : 'result-false'}">
                                ${compareStations ? '✓ Идентичны' : '✗ Различны'}
                            </div>
                        </div>
                        <div class="compare-item">
                            <div class="compare-label">ВДНХ = Балчуг</div>
                            <div class="compare-result ${compareDifferent ? 'result-true' : 'result-false'}">
                                ${compareDifferent ? '✓ Идентичны' : '✗ Различны'}
                            </div>
                        </div>
                        <div class="compare-item">
                            <div class="compare-label">Параметры ВДНХ = Параметры ВДНХ</div>
                            <div class="compare-result ${compareArrays ? 'result-true' : 'result-false'}">
                                ${compareArrays ? '✓ Идентичны' : '✗ Различны'}
                            </div>
                        </div>
                        <div class="compare-item">
                            <div class="compare-label">Параметры ВДНХ = Параметры Тушино</div>
                            <div class="compare-result ${compareArraysDiff ? 'result-true' : 'result-false'}">
                                ${compareArraysDiff ? '✓ Идентичны' : '✗ Различны'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    hasUniqueParams(station) {
        const count = this.stations.filter(s => s.params === station.params).length;
        return count === 1;
    }

    getFilteredData() {
        if (this.filterText === "") return this.stations;
        return this.stations.filter(item => 
            item.name.toLowerCase().includes(this.filterText.toLowerCase())
        );
    }

    addStation() {
        if (this.stations.length === 0) return;
        const first = this.stations[0];
        const newId = Math.max(...this.stations.map(s => s.id)) + 1;
        const newStation = {
            ...first,
            id: newId,
            name: first.name + " (копия)",
            lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };
        this.stations.push(newStation);
        this.render();
    }

    deleteStation(id) {
        this.stations = this.stations.filter(s => s.id !== id);
        this.render();
    }

    goToProduct(id) {
        import("../product/index.js").then(module => {
            const ProductPage = module.ProductPage;
            const productPage = new ProductPage(this.parent, id);
            productPage.render();
        });
    }

    getHTML() {
        return `
            <div class="custom-header">
                <div class="logo">
                    <h1>🌤️ Метеостанции Москвы</h1>
                    <p>Регистрация температуры | Актуальные данные</p>
                </div>
                <div id="home-button-container"></div>
            </div>
            <div class="container">
                <div class="action-buttons">
                    <button id="show-merge-btn" class="btn-action">📊 Сводка метеоданных</button>
                    <button id="show-compare-btn" class="btn-action">🔍 Сравнение станций</button>
                </div>
                
                <div id="merge-result"></div>
                <div id="compare-result"></div>
                
                <div class="filter-section">
                    <input type="text" id="filter-input" class="filter-input" placeholder="🔍 Поиск по названию...">
                    <button id="add-station-btn" class="btn-custom">➕ Копировать первую станцию</button>
                </div>
                <div id="stations-list" class="stations-grid"></div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = this.getHTML();

        const mergeBtn = document.getElementById('show-merge-btn');
        if (mergeBtn) {
            mergeBtn.onclick = () => this.showMergeResult();
        }

        const compareBtn = document.getElementById('show-compare-btn');
        if (compareBtn) {
            compareBtn.onclick = () => this.showCompareResult();
        }

        const homeContainer = document.getElementById('home-button-container');
        const homeBtn = new ButtonHome(homeContainer);
        homeBtn.render(() => {
            this.filterText = "";
            this.render();
        });

        const container = document.getElementById('stations-list');
        const filtered = this.getFilteredData();
        
        filtered.forEach(station => {
            const isUnique = this.hasUniqueParams(station);
            const card = new ProductCardComponent(container);
            card.render(
                station,
                (id) => this.goToProduct(id),
                (id) => this.deleteStation(id),
                isUnique
            );
        });

        const searchInput = document.getElementById('filter-input');
        if (searchInput) {
            searchInput.value = this.filterText;
            searchInput.oninput = (e) => {
                this.filterText = e.target.value;
                this.render();
            };
        }

        const addBtn = document.getElementById('add-station-btn');
        if (addBtn) {
            addBtn.onclick = () => this.addStation();
        }
    }
}