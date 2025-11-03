import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */let c=[];document.addEventListener("DOMContentLoaded",()=>{u(),f(),v(),m(),x(),h(),b()});function u(){c=[{id:1,nombre:"Botella Reutilizable Acero",categoria:"Sustentable",fecha:"2025-09-25",precio:15e3,puntos:15,co2Ahorrado:2.3,descripcion:"Botella de acero inoxidable que evita el uso de 150 botellas plásticas al año",imagen:"🍃"},{id:2,nombre:"Panel Solar Portátil",categoria:"Energía Renovable",fecha:"2025-08-20",precio:85e3,puntos:50,co2Ahorrado:15.8,descripcion:"Panel solar que genera energía limpia, evitando emisiones de la red eléctrica",imagen:"☀️"},{id:3,nombre:"Bolsas Biodegradables",categoria:"Eco-Packaging",fecha:"2025-08-15",precio:8500,puntos:8,co2Ahorrado:.8,descripcion:"Pack de 50 bolsas biodegradables que se descomponen en 6 meses",imagen:"🌱"},{id:4,nombre:"Cargador Solar USB",categoria:"Energía Renovable",fecha:"2025-07-10",precio:25e3,puntos:25,co2Ahorrado:3.2,descripcion:"Cargador portátil que usa energía solar, evitando consumo eléctrico tradicional",imagen:"🔋"}],localStorage.setItem("productosEco",JSON.stringify(c))}function f(){const t=new Date,o=t.getMonth(),n=t.getFullYear(),e=c.filter(i=>{const l=new Date(i.fecha);return l.getMonth()===o&&l.getFullYear()===n}).reduce((i,l)=>i+l.co2Ahorrado,0),r=c.reduce((i,l)=>i+l.co2Ahorrado,0);document.getElementById("co2MesActual").textContent=e.toFixed(1),document.getElementById("co2Total").textContent=r.toFixed(1);const s=Math.min(e/5*100,100),d=document.getElementById("barraProgresoCO2");d&&(d.style.width=`${s}%`);const g=document.getElementById("textoProgreso");if(g){let i="";s>=100?i="🎉 ¡Meta alcanzada! ¡Increíble trabajo!":s>=75?i=`${Math.round(s)}% completado - ¡Casi logras la meta! 🌟`:s>=50?i=`${Math.round(s)}% completado - ¡Excelente progreso! 🌱`:s>=25?i=`${Math.round(s)}% completado - ¡Buen avance! 💚`:i=`${Math.round(s)}% completado - ¡Sigue así! 🌱`,g.textContent=i}}function v(){const t=document.getElementById("graficoTendenciaCO2");if(!t)return;const o=[],n=[];for(let e=5;e>=0;e--){const r=new Date;r.setMonth(r.getMonth()-e),o.push(r.toLocaleDateString("es-ES",{month:"short"}));const a=Math.random()*4+1+e*.3;n.push(a)}new Chart(t,{type:"line",data:{labels:o,datasets:[{label:"CO₂ Ahorrado (kg)",data:n,borderColor:"#10B981",backgroundColor:"rgba(16, 185, 129, 0.1)",fill:!0,tension:.4,pointBackgroundColor:"#10B981",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(0,0,0,0.05)"},ticks:{callback:function(e){return e.toFixed(1)+" kg"}}},x:{grid:{display:!1}}}}})}function m(){const t=document.getElementById("listaProductosEco"),o=document.getElementById("sinProductos");if(c.length===0){t.classList.add("hidden"),o.classList.remove("hidden");return}t.innerHTML="",o.classList.add("hidden"),[...c].sort((e,r)=>new Date(r.fecha)-new Date(e.fecha)).forEach(e=>{const r=new Date(e.fecha).toLocaleDateString("es-ES",{day:"numeric",month:"short"}),a=document.createElement("div");a.className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer",a.onclick=()=>y(e),a.innerHTML=`
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${e.imagen}</div>
                    <div>
                        <div class="font-semibold text-gray-800">${e.nombre}</div>
                        <div class="text-sm text-gray-600">${e.categoria}</div>
                        <div class="text-xs text-gray-500 flex items-center mt-1">
                            <i class="fas fa-calendar mr-1"></i>
                            ${r}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-green-600 flex items-center">
                        <i class="fas fa-leaf mr-1"></i>
                        ${e.co2Ahorrado} kg CO₂
                    </div>
                    <div class="text-sm text-gray-600">${e.puntos} puntos</div>
                    <div class="text-xs text-gray-500">$${e.precio.toLocaleString()}</div>
                </div>
            </div>
        `,t.appendChild(a)})}function x(){const t=document.getElementById("categoriasCO2"),o={};c.forEach(a=>{o[a.categoria]||(o[a.categoria]={nombre:a.categoria,co2Total:0,cantidad:0,color:""}),o[a.categoria].co2Total+=a.co2Ahorrado,o[a.categoria].cantidad+=1});const n=["green","blue","purple","yellow","red","indigo"];let e=0;const r=Object.values(o).reduce((a,s)=>a+s.co2Total,0);t.innerHTML="",Object.values(o).forEach(a=>{a.color=n[e%n.length],e++;const s=r>0?a.co2Total/r*100:0,d=document.createElement("div");d.className="flex items-center justify-between p-3 bg-gray-50 rounded-lg",d.innerHTML=`
            <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-${a.color}-500 rounded-full"></div>
                <div>
                    <div class="font-medium">${a.nombre}</div>
                    <div class="text-sm text-gray-600">${a.cantidad} productos</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-${a.color}-600">${a.co2Total.toFixed(1)} kg</div>
                <div class="text-xs text-gray-500">${s.toFixed(1)}%</div>
            </div>
        `,t.appendChild(d)})}function h(){const t=document.getElementById("logrosAmbientales"),o=c.reduce((e,r)=>e+r.co2Ahorrado,0),n=[{nombre:"Primer Ahorro",descripcion:"Primera compra ECO",icono:"seedling",conseguido:c.length>0,color:"green"},{nombre:"Eco Warrior",descripcion:"5+ kg CO₂ ahorrado",icono:"shield-alt",conseguido:o>=5,color:"blue"},{nombre:"Carbon Saver",descripcion:"10+ kg CO₂ ahorrado",icono:"award",conseguido:o>=10,color:"purple"},{nombre:"Planet Hero",descripción:"20+ kg CO₂ ahorrado",icono:"trophy",conseguido:o>=20,color:"yellow"}];t.innerHTML="",n.forEach(e=>{const r=document.createElement("div");r.className=`text-center p-3 rounded-lg transition-all ${e.conseguido?`bg-${e.color}-50`:"bg-gray-100 opacity-50"}`,r.innerHTML=`
            <i class="fas fa-${e.icono} ${e.conseguido?`text-${e.color}-500`:"text-gray-400"} text-2xl mb-2"></i>
            <div class="text-xs font-semibold ${e.conseguido?"text-gray-800":"text-gray-500"}">${e.nombre}</div>
            <div class="text-xs ${e.conseguido?"text-gray-600":"text-gray-400"} mt-1">${e.descripcion}</div>
        `,t.appendChild(r)})}function b(){document.getElementById("filtroTiempo").addEventListener("change",o=>{const n=o.target.value;p(n)})}function p(t){const o=new Date;let n;switch(t){case"mes":n=new Date(o.getFullYear(),o.getMonth(),1);break;case"trimestre":n=new Date(o.getFullYear(),o.getMonth()-3,1);break;case"año":n=new Date(o.getFullYear(),0,1);break;default:n=new Date(0)}const e=c.filter(a=>new Date(a.fecha)>=n),r=[...c];c=e,m(),c=r}function y(t){const o=document.getElementById("modalDetalles"),n=document.getElementById("detalleProducto"),e=new Date(t.fecha).toLocaleDateString("es-ES",{weekday:"long",year:"numeric",month:"long",day:"numeric"});n.innerHTML=`
        <div class="text-4xl mb-4">${t.imagen}</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">${t.nombre}</h3>
        <p class="text-gray-600 mb-4">${t.descripcion}</p>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">${t.co2Ahorrado} kg</div>
                <div class="text-xs text-gray-600">CO₂ Ahorrado</div>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">${t.puntos}</div>
                <div class="text-xs text-gray-600">Puntos ECO</div>
            </div>
        </div>
        
        <div class="text-sm text-gray-500 mb-4">
            <div class="mb-1"><strong>Categoría:</strong> ${t.categoria}</div>
            <div class="mb-1"><strong>Precio:</strong> $${t.precio.toLocaleString()}</div>
            <div><strong>Fecha:</strong> ${e}</div>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div class="flex items-center text-green-800">
                <i class="fas fa-info-circle mr-2"></i>
                <span class="text-sm font-medium">Impacto Ambiental</span>
            </div>
            <p class="text-green-700 text-sm mt-1">
                Este producto ha evitado la emisión de <strong>${t.co2Ahorrado} kg de CO₂</strong> 
                comparado con alternativas tradicionales.
            </p>
        </div>
    `,o.style.display="flex",o.classList.add("show")}function E(){const t=document.getElementById("modalDetalles");t.style.display="none",t.classList.remove("show")}document.addEventListener("click",function(t){const o=document.getElementById("modalDetalles");t.target===o&&E()});
