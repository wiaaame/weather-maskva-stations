const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BywntVn7.js","assets/index-GNN2BdNA.css"])))=>i.map(i=>d[i]);
import{w as m,a as p,B as u,_ as h}from"./index-BywntVn7.js";class f{constructor(t,e){this.parent=t,this.id=e,this.stationData=null}getHTML(){return this.stationData?`
            <div class="custom-header">
                <div class="logo">
                    <h1>✏️ Редактирование: ${this.stationData.name}</h1>
                    <p>Просмотр и изменение полей</p>
                </div>
                <div id="home-header"></div>
            </div>
            <div class="container">
                <div class="form-container">
                    <div class="form-group">
                        <label>📍 Название метеостанции</label>
                        <input type="text" id="edit-name" class="filter-input" style="width: 100%;" value="${this.stationData.name}">
                    </div>
                    <div class="form-group">
                        <label>🌡️ Температура</label>
                        <input type="text" id="edit-temp" class="filter-input" style="width: 100%;" value="${this.stationData.temp}">
                    </div>
                    <div class="form-group">
                        <label>💧 Влажность</label>
                        <input type="text" id="edit-humidity" class="filter-input" style="width: 100%;" value="${this.stationData.humidity}">
                    </div>
                    <div class="form-group">
                        <label>📊 Давление</label>
                        <input type="text" id="edit-pressure" class="filter-input" style="width: 100%;" value="${this.stationData.pressure}">
                    </div>
                    <div class="form-group">
                        <label>🖼️ URL изображения</label>
                        <input type="text" id="edit-src" class="filter-input" style="width: 100%;" value="${this.stationData.src||""}">
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button id="cancel-btn" class="btn-custom" style="flex: 1;">❌ Отмена</button>
                    </div>
                    
                    <div id="preview-area" style="margin-top: 2rem; display: none;">
                        <h3>👁️ Предпросмотр карточки:</h3>
                        <div id="preview-card"></div>
                    </div>
                </div>
            </div>
        `:`
                <div class="custom-header">
                    <div class="logo">
                        <h1>✏️ Редактирование метеостанции</h1>
                        <p>Загрузка данных...</p>
                    </div>
                    <div id="home-header"></div>
                </div>
                <div class="container" style="text-align: center; padding: 3rem;">Загрузка...</div>
            `}showPreview(){var o,l,r,c,v;const t=((o=document.getElementById("edit-name"))==null?void 0:o.value)||"Название",e=((l=document.getElementById("edit-temp"))==null?void 0:l.value)||"0",i=((r=document.getElementById("edit-humidity"))==null?void 0:r.value)||"0%",d=((c=document.getElementById("edit-pressure"))==null?void 0:c.value)||"0",s=((v=document.getElementById("edit-src"))==null?void 0:v.value)||"https://picsum.photos/id/15/400/300",a=document.getElementById("preview-area"),n=document.getElementById("preview-card");a&&n&&(a.style.display="block",n.innerHTML=`
                <div class="weather_station_card" style="margin-top: 1rem;">
                    <img src="${s}" class="card-img-top" alt="${t}" style="height: 160px; object-fit: cover;">
                    <div class="card-body">
                        <div class="card-title">📍 ${t}</div>
                        <div class="temp-badge">${e}°C</div>
                        <div class="station-info">💧 Влажность: ${i}</div>
                        <div class="station-info">📊 Давление: ${d}</div>
                        <div>
                            <button class="btn-card" style="opacity: 0.7;">🔍 Подробнее</button>
                        </div>
                    </div>
                </div>
            `)}loadData(){const t=m.getWeatherStationById(this.id);console.log("GET редактирование:",t),p.get(t,(e,i)=>{i===200&&e?(this.stationData=e,this.updateHTML()):console.error("Ошибка загрузки:",i)})}updateHTML(){this.parent.innerHTML=this.getHTML();const t=document.getElementById("home-header");new u(t).render(()=>this.goToMain());const i=document.getElementById("cancel-btn");i&&(i.onclick=()=>this.goToMain()),["edit-name","edit-temp","edit-humidity","edit-pressure","edit-src"].forEach(s=>{const a=document.getElementById(s);a&&(a.oninput=()=>this.showPreview())}),this.showPreview()}goToMain(){h(()=>import("./index-BywntVn7.js").then(t=>t.i),__vite__mapDeps([0,1])).then(t=>{const e=t.MainPage;new e(this.parent).render()})}render(){this.loadData()}}export{f as EditWeatherStationPage};
