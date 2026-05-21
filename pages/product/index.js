import { BackButtonComponent } from "../../components/back-button/index.js";
import { ButtonHome } from "../../components/button-home/index.js";
import { ProductComponent } from "../../components/product/index.js";
import { ThreeViewer } from "../../modules/three-viewer.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.viewer = null;
    }

    // ДЗ: проверка палиндрома
    isPalindrome(str) {
        const cleaned = str.toLowerCase().replace(/\s/g, '');
        return cleaned === cleaned.split('').reverse().join('');
    }

    getData() {
        const stations = {
            1: { id: 1, name: "ВДНХ", temp: "-2.5", humidity: "78%", pressure: "1012 hPa", lastUpdate: "2026-04-22 08:00", description: "Основная метеостанция Москвы. Данные с 1939 года." },
            2: { id: 2, name: "Балчуг", temp: "-1.8", humidity: "75%", pressure: "1013 hPa", lastUpdate: "2026-04-22 08:15", description: "Станция в центре Москвы, показывает микроклимат Замоскворечья." },
            3: { id: 3, name: "Тушино", temp: "-3.2", humidity: "82%", pressure: "1011 hPa", lastUpdate: "2026-04-22 07:45", description: "Северо-запад Москвы, часто на 1-2° холоднее центра." },
            4: { id: 4, name: "МГУ", temp: "-2.1", humidity: "76%", pressure: "1012 hPa", lastUpdate: "2026-04-22 08:30", description: "Воробьёвы горы, высота над уровнем моря влияет на показания." }
        };
        return stations[this.id];
    }

    goToMain() {
        if (this.viewer) {
            this.viewer.dispose();
        }
        import("../main/index.js").then(module => {
            const MainPage = module.MainPage;
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        });
    }


    render() {
        const data = this.getData();
        if (!data) {
            this.parent.innerHTML = '<p>Станция не найдена</p>';
            return;
        }

        const isPalin = this.isPalindrome(data.name);
        const palinBadge = isPalin ? '<span style="background:#ffc107; padding:4px 12px; border-radius:20px; margin-left:12px;">🏆 Палиндром!</span>' : '';

        this.parent.innerHTML = `
            <div class="custom-header">
                <div class="logo">
                    <h1>🌡️ ${data.name} ${palinBadge}</h1>
                    <p>Метеостанция | 3D визуализация</p>
                </div>
                <div id="home-header"></div>
            </div>
            <div class="container" style="padding: 2rem; max-width: 1200px;">
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem;">
                    <!-- Левая колонка - информация -->
                    <div>
                        <div id="product-detail"></div>
                        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button id="back-btn" class="btn-custom">◀ Назад</button>
                        </div>
                    </div>
                    
                    <!-- Правая колонка - 3D -->
                    <div>
                        <h3>🌍 3D Метео-визуализация</h3>
                        <div id="three-container" style="width: 100%; height: 400px; background: #1e2f42; border-radius: 12px; overflow: hidden; position: relative;"></div>
                        
                        <!-- Панель управления 3D -->
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                            <button id="zoom-in-btn" class="btn-card" title="Приблизить">🔍+</button>
                            <button id="zoom-out-btn" class="btn-card" title="Отдалить">🔍-</button>
                            <button id="view-front-btn" class="btn-card" title="Вид спереди">⬆️ Спереди</button>
                            <button id="view-back-btn" class="btn-card" title="Вид сзади">⬇️ Сзади</button>
                            <button id="view-left-btn" class="btn-card" title="Вид слева">⬅️ Слева</button>
                            <button id="view-right-btn" class="btn-card" title="Вид справа">➡️ Справа</button>
                            <button id="view-top-btn" class="btn-card" title="Вид сверху">🔽 Сверху</button>
                            <button id="reset-view-btn" class="btn-card" title="Сбросить камеру">🔄 Сброс</button>
                            <button id="auto-rotate-btn" class="btn-card" title="Автовращение">🎬 Вращать</button>
                        </div>
                        <p style="font-size: 0.75rem; color: #666; margin-top: 0.5rem; text-align: center;">
                            🖱️ Мышь: вращение | ПКМ: панорамирование | Скролл: зум
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Кнопка Домой
        const homeContainer = document.getElementById('home-header');
        const homeBtn = new ButtonHome(homeContainer);
        homeBtn.render(() => this.goToMain());

        // Детали станции
        const detailDiv = document.getElementById('product-detail');
        const enhancedData = { ...data, title: data.name, text: data.description };
        
        const productComp = new ProductComponent(detailDiv);
        productComp.render(enhancedData);

        // Кнопка Назад
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.onclick = () => this.goToMain();

        // Кнопка сравнения
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) compareBtn.onclick = () => this.showCompareModal();

        // Инициализация 3D
        this.viewer = new ThreeViewer('three-container', {
            backgroundColor: 0x1e2f42,
            cameraPosition: { x: 3, y: 2, z: 5 }
        });
        
        // Попытка загрузить GLB модель из папки models/
        // Если файла нет - автоматически покажется запасная сфера
        this.viewer.loadModel('./models/weather-balloon.glb').catch(() => {
            console.log('Используется встроенная 3D модель');
        });
        
        // Подключаем кнопки управления
        document.getElementById('zoom-in-btn')?.addEventListener('click', () => this.viewer.zoomIn());
        document.getElementById('zoom-out-btn')?.addEventListener('click', () => this.viewer.zoomOut());
        document.getElementById('view-front-btn')?.addEventListener('click', () => this.viewer.viewFront());
        document.getElementById('view-back-btn')?.addEventListener('click', () => this.viewer.viewBack());
        document.getElementById('view-left-btn')?.addEventListener('click', () => this.viewer.viewLeft());
        document.getElementById('view-right-btn')?.addEventListener('click', () => this.viewer.viewRight());
        document.getElementById('view-top-btn')?.addEventListener('click', () => this.viewer.viewTop());
        document.getElementById('reset-view-btn')?.addEventListener('click', () => this.viewer.resetView());
        
        let autoRotate = false;
        document.getElementById('auto-rotate-btn')?.addEventListener('click', () => {
            autoRotate = this.viewer.toggleAutoRotate();
            const btn = document.getElementById('auto-rotate-btn');
            btn.style.backgroundColor = autoRotate ? '#ffc107' : '#e6f0fa';
            btn.textContent = autoRotate ? '⏸️ Стоп' : '🎬 Вращать';
        });
    }
}