export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div style="border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                <img src="${data.src}" style="width: 100%; height: 300px; object-fit: cover;" alt="${data.name}">
                <div style="padding: 1.5rem;">
                    <h2>${data.title || data.name}</h2>
                    <p style="font-size: 1.1rem; color: #555;">${data.text || "Информация о метеостанции"}</p>
                    <hr>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>🌡️ Температура:</strong> ${data.temp}°C</li>
                        <li><strong>💧 Влажность:</strong> ${data.humidity}</li>
                        <li><strong>📊 Давление:</strong> ${data.pressure}</li>
                        <li><strong>📅 Последнее обновление:</strong> ${data.lastUpdate}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.innerHTML = this.getHTML(data);
    }
}