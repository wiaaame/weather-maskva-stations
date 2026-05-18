export class ButtonHome {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `<button id="home-btn" class="btn-custom">🏠 Домой</button>`;
    }

    render(listener) {
        this.parent.innerHTML = this.getHTML();
        document.getElementById('home-btn').onclick = listener;
    }
}