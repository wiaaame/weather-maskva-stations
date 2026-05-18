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

    // Проверка палиндрома
    isPalindrome(str) {
        const cleaned = str.toLowerCase().replace(/[^а-яёa-z0-9]/g, '');
     return cleaned === cleaned.split('').reverse().join('');
    }

    // Цикл с постусловием
    findStationById(id) {
        let i = 0;
        let found = null;
        do {
            if (this.stations[i]?.id === id) found = this.stations[i];
            i++;
        } while (i < this.stations.length && !found);
        return found;
    }

    // ДЗ: функция объединения объектов
    mergeObjects(...objects) {
        const result = {};
        for (let i = 0; i < objects.length; i++) {
            const currentObj = objects[i];
            for (const key in currentObj) {
                if (currentObj.hasOwnProperty(key) && !(key in result)) {
                    result[key] = currentObj[key];
                }
            }
        }
        return result;
    }

    // Проверка уникальности параметров
    hasUniqueParams(station) {
        const merged = this.mergeObjects({ params: station.params });
        const count = this.stations.filter(s => s.params === merged.params).length;
        return count === 1;
    }

    // Получение отфильтрованных данных
    getFilteredData() {
        if (this.filterText === "") return this.stations;
        return this.stations.filter(item => 
            item.name.toLowerCase().includes(this.filterText.toLowerCase())
        );
    }

    // Копирование первой станции
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

    // Удаление станции
    deleteStation(id) {
        this.stations = this.stations.filter(s => s.id !== id);
        this.render();
    }

    // Переход на страницу деталей
    goToProduct(id) {
        import("../product/index.js").then(module => {
            const ProductPage = module.ProductPage;
            const productPage = new ProductPage(this.parent, id);
            productPage.render();
        });
    }

    // Рендер главной страницы
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

        // Кнопка Домой
        const homeContainer = document.getElementById('home-button-container');
        const homeBtn = new ButtonHome(homeContainer);
        homeBtn.render(() => {
            this.filterText = "";
            this.render();
        });

        // Отображение карточек
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

        // Поиск
        const searchInput = document.getElementById('filter-input');
        if (searchInput) {
            searchInput.value = this.filterText;
            searchInput.oninput = (e) => {
                this.filterText = e.target.value;
                this.render();
            };
        }

        // Кнопка добавления
        const addBtn = document.getElementById('add-station-btn');
        if (addBtn) {
            addBtn.onclick = () => this.addStation();
        }
    }
}