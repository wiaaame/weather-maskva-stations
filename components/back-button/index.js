export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `<button id="back-btn" class="btn-custom" style="margin-top: 1rem;">◀ Назад к списку</button>`;
    }

    render(listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        document.getElementById('back-btn').onclick = listener;
    }
}