const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BAjvUqPl.js","assets/index-GNN2BdNA.css"])))=>i.map(i=>d[i]);
import{w as u,a as v,B as h,_ as p}from"./index-BAjvUqPl.js";class f{constructor(t,e){this.parent=t,this.id=e,this.stationData=null}getHTML(){return this.stationData?`
            <div class="custom-header">
                <div class="logo">
                    <h1>✏️ Редактирование: ${this.stationData.name}</h1>
                    <p>Измените данные и нажмите Сохранить</p>
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
                        <button id="save-btn" class="btn-custom" style="flex: 1;">💾 Сохранить</button>
                        <button id="cancel-btn" class="btn-custom" style="flex: 1;">❌ Отмена</button>
                    </div>
                    
                    <div id="message-area" style="margin-top: 1rem;"></div>
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
            `}showPreview(){var o,l,r,c,m;const t=((o=document.getElementById("edit-name"))==null?void 0:o.value)||"Название",e=((l=document.getElementById("edit-temp"))==null?void 0:l.value)||"0",i=((r=document.getElementById("edit-humidity"))==null?void 0:r.value)||"0%",a=((c=document.getElementById("edit-pressure"))==null?void 0:c.value)||"0",n=((m=document.getElementById("edit-src"))==null?void 0:m.value)||"https://picsum.photos/id/15/400/300",d=document.getElementById("preview-area"),s=document.getElementById("preview-card");d&&s&&(d.style.display="block",s.innerHTML=`
                <div class="weather_station_card" style="margin-top: 1rem;">
                    <img src="${n}" class="card-img-top" alt="${t}" style="height: 160px; object-fit: cover;">
                    <div class="card-body">
                        <div class="card-title">📍 ${t}</div>
                        <div class="temp-badge">${e}°C</div>
                        <div class="station-info">💧 Влажность: ${i}</div>
                        <div class="station-info">📊 Давление: ${a}</div>
                        <div>
                            <button class="btn-card" style="opacity: 0.7;">🔍 Подробнее</button>
                        </div>
                    </div>
                </div>
            `)}showMessage(t,e=!1){const i=document.getElementById("message-area");i&&(i.innerHTML=`<div style="background: ${e?"#f8d7da":"#d4edda"}; padding: 0.75rem; border-radius: 8px; margin-top: 1rem;">${t}</div>`,setTimeout(()=>{i.innerHTML=""},3e3))}async loadData(){const t=u.getWeatherStationById(this.id),{data:e,status:i}=await v.get(t);i===200&&e?(this.stationData=e,this.updateHTML()):this.showMessage("Ошибка загрузки данных",!0)}async saveChanges(){var a,n,d,s,o;const t={name:(a=document.getElementById("edit-name"))==null?void 0:a.value,temp:(n=document.getElementById("edit-temp"))==null?void 0:n.value,humidity:(d=document.getElementById("edit-humidity"))==null?void 0:d.value,pressure:(s=document.getElementById("edit-pressure"))==null?void 0:s.value,src:(o=document.getElementById("edit-src"))==null?void 0:o.value};if(!t.name||!t.temp||!t.humidity||!t.pressure){this.showMessage("Заполните все обязательные поля!",!0);return}const e=u.updateWeatherStationById(this.id),{status:i}=await v.patch(e,t);i===200?(this.showMessage("✅ Метеостанция успешно обновлена!"),setTimeout(()=>this.goToMain(),1500)):this.showMessage("❌ Ошибка при обновлении",!0)}updateHTML(){this.parent.innerHTML=this.getHTML();const t=document.getElementById("home-header");new h(t).render(()=>this.goToMain());const i=document.getElementById("save-btn");i&&(i.onclick=()=>this.saveChanges());const a=document.getElementById("cancel-btn");a&&(a.onclick=()=>this.goToMain()),["edit-name","edit-temp","edit-humidity","edit-pressure","edit-src"].forEach(d=>{const s=document.getElementById(d);s&&(s.oninput=()=>this.showPreview())}),this.showPreview()}goToMain(){p(()=>import("./index-BAjvUqPl.js").then(t=>t.i),__vite__mapDeps([0,1])).then(t=>{const e=t.MainPage;new e(this.parent).render()})}render(){this.loadData()}}export{f as EditWeatherStationPage};
