import { MainPage } from "./pages/main/index.js";

const root = document.getElementById('root');

// Глобальная функция для смены страниц
window.renderPage = (PageClass, ...args) => {
    root.innerHTML = '';
    const page = new PageClass(root, ...args);
    page.render();
};

// Запуск приложения
const mainPage = new MainPage(root);
mainPage.render();