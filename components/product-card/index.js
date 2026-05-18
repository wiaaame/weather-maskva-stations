export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data, isUnique) {
        return `
            <div class="station-card" data-id="${data.id}">
                <img src="${data.src}" class="card-img-top" alt="${data.name}">
                <div class="card-body">
                    <div class="card-title">📍 ${data.name}</div>
                    <div class="temp-badge">${data.temp}°C</div>
                    <div>💧 Влажность: ${data.humidity}</div>
                    <div>📊 Давление: ${data.pressure}</div>
                    <div>🕒 ${data.lastUpdate}</div>
                    ${isUnique ? '<div class="unique-badge">✅ Уникальные параметры</div>' : ''}
                    <div>
                        <button class="btn-card details-btn" data-id="${data.id}">🔍 Подробнее</button>
                        <button class="btn-card delete-btn" data-id="${data.id}">🗑️ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    render(data, onDetails, onDelete, isUnique) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data, isUnique));
        
        const card = this.parent.querySelector(`.station-card[data-id='${data.id}']`);
        const detailsBtn = card.querySelector('.details-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        detailsBtn.onclick = () => onDetails(data.id);
        deleteBtn.onclick = () => onDelete(data.id);
    }
}