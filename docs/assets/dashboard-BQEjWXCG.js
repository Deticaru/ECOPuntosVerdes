import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */let g=0,r=[],m=JSON.parse(localStorage.getItem("productosFavoritos"))||[],y=[{id:1,nombre:"10% Descuento Walmart",puntos:50,activo:!0,app:"Walmart"},{id:2,nombre:"5% Descuento EcoPuntos",puntos:20,activo:!0,app:"EcoPuntos"},{id:3,nombre:"15% Descuento Walmart",puntos:100,activo:!1,app:"Walmart"}];function i(t){return t.toString().replace(".",",")}function M(){const t=new Date;return`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][t.getMonth()]} ${t.getFullYear()}`}const n={meses:["Julio","Agosto","Septiembre","Octubre"],años:[2025],puntosPorMes:[85,92,156,123],impactoPorMes:[3.2,4.1,7.8,5.8],categorias:["Productos Reutilizables","Energía Renovable","Alimentación Orgánica","Transporte Ecológico"],porcentajesImpacto:[35,28,22,15]};document.addEventListener("DOMContentLoaded",()=>{C(),b(),S(),P()});function P(){const t=document.getElementById("linkCupones");t&&t.addEventListener("click",a=>{a.preventDefault(),E()});const e=document.getElementById("linkFavoritos");e&&e.addEventListener("click",a=>{a.preventDefault(),$()});const o=document.getElementById("formNotificaciones");o&&o.addEventListener("submit",N),k()}function k(){["modalCupones","modalFavoritos","modalNotificaciones"].forEach(t=>{const e=document.getElementById(t);e&&e.addEventListener("click",o=>{o.target===e&&(t==="modalCupones"&&x(),t==="modalFavoritos"&&F(),t==="modalNotificaciones"&&v())})})}function C(){g=parseInt(localStorage.getItem("puntosUsuario"))||123,r=JSON.parse(localStorage.getItem("historialCompras"))||[],r.length===0&&(r=[{id:1,fecha:"2025-10-15",producto:"Botella de Agua Reutilizable",precio:15e3,puntos:15,carbono:-2.3,categoria:"Sustentable"},{id:2,fecha:"2025-10-08",producto:"Panel Solar Portátil",precio:85e3,puntos:50,carbono:-15.8,categoria:"Energía Renovable"}],localStorage.setItem("historialCompras",JSON.stringify(r)))}function b(){document.getElementById("periodoActual").textContent=`Período: ${M()}`,document.getElementById("graficoFechas").textContent=`${n.meses[0]} - ${n.meses[n.meses.length-1]} ${n.años[0]}`;const t=r.reduce((u,d)=>u+Math.abs(d.carbono),0),e=t/22,o=r.reduce((u,d)=>u+d.precio*.15,0);s("totalPuntos",g),s("carbonoEvitado",i(t.toFixed(1))),s("totalCompras",r.length),s("ahorroTotal",`$${o.toLocaleString("es-CO")}`);const a=n.puntosPorMes.reduce((u,d)=>u+d,0)/n.puntosPorMes.length,c=n.puntosPorMes[n.puntosPorMes.length-2],l=n.puntosPorMes[n.puntosPorMes.length-1],p=(l-c)/c*100;s("puntosMesActual",l),s("promedioMensual",i(a.toFixed(1))),s("crecimientoMensual",`${p>0?"+":""}${i(p.toFixed(1))}%`),s("co2Evitado",i(t.toFixed(1))),s("arbolesEquiv",i(e.toFixed(2))),s("aguaAhorrada",i((t*21.6).toFixed(1))),s("residuosReducidos",i((t*.4).toFixed(1))),L()}function s(t,e){const o=document.getElementById(t);o&&(o.textContent=e)}function L(){const t=document.getElementById("historialCompras"),e=document.getElementById("sinCompras");if(r.length===0){t.classList.add("hidden"),e.classList.remove("hidden");return}t.innerHTML=r.map(o=>{const a=new Date(o.fecha).toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"}),c=o.carbono<0?"text-green-600":"text-red-600",l=o.carbono<0?"fa-leaf":"fa-exclamation-triangle";return`
            <div class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 text-lg">${o.producto}</h4>
                        <p class="text-sm text-gray-600">${a}</p>
                        <div class="flex items-center space-x-4 mt-2">
                            <span class="text-sm text-gray-600">Categoría: <strong>${o.categoria}</strong></span>
                            <span class="text-sm text-green-600">+${o.puntos} puntos</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-xl text-gray-800">$${o.precio.toLocaleString("es-CO")}</div>
                        <div class="text-sm ${c} flex items-center justify-end mt-1">
                            <i class="fas ${l} mr-1"></i>
                            ${i(Math.abs(o.carbono).toFixed(1))} kg CO₂
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Impacto ambiental:</span>
                        <span class="${c} font-semibold">
                            ${o.carbono<0?"Reducción":"Emisión"} de ${i(Math.abs(o.carbono).toFixed(1))} kg CO₂
                        </span>
                    </div>
                    <div class="flex justify-between text-sm mt-1">
                        <span class="text-gray-600">Equivalencia forestal:</span>
                        <span class="text-blue-600 font-semibold">${i((Math.abs(o.carbono)/22).toFixed(3))} árboles</span>
                    </div>
                </div>
            </div>
        `}).join("")}function S(){B(),D(),A()}function B(){const t=document.getElementById("graficoMensual").getContext("2d");new Chart(t,{type:"line",data:{labels:n.meses,datasets:[{label:"Puntos Verdes Ganados",data:n.puntosPorMes,borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:3,fill:!0,tension:.4,pointBackgroundColor:"#10b981",pointBorderColor:"#ffffff",pointBorderWidth:3,pointRadius:6,pointHoverRadius:8}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:`Evolución de Puntos Ecológicos - ${n.años[0]}`,font:{size:16,weight:"bold"}},legend:{display:!0,position:"bottom"},tooltip:{callbacks:{label:function(e){const o=i(e.parsed.y),a=(e.parsed.y/150*100).toFixed(1);return`Puntos: ${o} (${i(a)}% de la meta)`}}}},scales:{y:{beginAtZero:!0,max:200,ticks:{callback:function(e){return i(e)+" pts"}},title:{display:!0,text:"Puntos Verdes"}},x:{title:{display:!0,text:"Meses - 2025"}}}}})}function D(){const t=document.getElementById("graficoImpacto").getContext("2d");new Chart(t,{type:"doughnut",data:{labels:n.categorias,datasets:[{data:n.porcentajesImpacto,backgroundColor:["#10b981","#3b82f6","#f59e0b","#8b5cf6"],borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:"Distribución del Impacto Ambiental por Categoría",font:{size:14,weight:"bold"}},legend:{position:"bottom"},tooltip:{callbacks:{label:function(e){const o=i(e.parsed);return`${e.label}: ${o}%`}}}}}})}function A(){const t=document.getElementById("graficoComparativo").getContext("2d");new Chart(t,{type:"bar",data:{labels:n.meses,datasets:[{label:"Puntos Ganados",data:n.puntosPorMes,backgroundColor:"rgba(16, 185, 129, 0.8)",borderColor:"#10b981",borderWidth:1},{label:"CO₂ Evitado (kg)",data:n.impactoPorMes,backgroundColor:"rgba(59, 130, 246, 0.8)",borderColor:"#3b82f6",borderWidth:1,yAxisID:"y1"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:"Comparativa Mensual: Puntos vs Impacto Ambiental",font:{size:14,weight:"bold"}},legend:{position:"bottom"},tooltip:{callbacks:{label:function(e){const o=i(e.parsed.y),a=e.datasetIndex===0?" puntos":" kg CO₂";return`${e.dataset.label}: ${o}${a}`}}}},scales:{y:{type:"linear",display:!0,position:"left",title:{display:!0,text:"Puntos Verdes"},ticks:{callback:function(e){return i(e)}}},y1:{type:"linear",display:!0,position:"right",title:{display:!0,text:"CO₂ Evitado (kg)"},ticks:{callback:function(e){return i(e)}},grid:{drawOnChartArea:!1}},x:{title:{display:!0,text:"Meses - 2025"}}}}})}function j(){document.getElementById("userMenu").classList.toggle("hidden")}function O(){document.getElementById("modalNotificaciones").classList.remove("hidden"),document.getElementById("userMenu").classList.add("hidden")}function v(){document.getElementById("modalNotificaciones").classList.add("hidden")}function N(t){t.preventDefault();const e={puntos:this.puntos.checked,promociones:this.promociones.checked,productos:this.productos.checked,habitos:this.habitos.checked};localStorage.setItem("notificaciones",JSON.stringify(e)),f("✅ Preferencias guardadas"),v()}function E(){document.getElementById("modalCupones").classList.remove("hidden"),w()}function x(){document.getElementById("modalCupones").classList.add("hidden")}function w(){const t=document.getElementById("listaCupones");t.innerHTML="",y.forEach(e=>{const o=g>=e.puntos&&e.activo;t.innerHTML+=`
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                    <div class="font-semibold">${e.nombre}</div>
                    <div class="text-xs text-gray-500">Requiere ${e.puntos} puntos • ${e.app}</div>
                </div>
                <button ${o?"":"disabled"} 
                    class="px-3 py-1 rounded-lg text-white ${o?"bg-green-500 hover:bg-green-600":"bg-gray-300 cursor-not-allowed"}"
                    onclick="canjearCupon(${e.id})">
                    Canjear
                </button>
            </div>
        `})}function T(t){const e=y.find(o=>o.id===t);if(!e||!e.activo){alert("❌ Este cupón ya no está disponible.");return}if(g<e.puntos){alert("❌ No tienes puntos suficientes para canjear este cupón.");return}g-=e.puntos,localStorage.setItem("puntosUsuario",g),f(`✅ Cupón canjeado: ${e.nombre} (${e.app})`),w(),b(),x()}function $(){document.getElementById("modalFavoritos").classList.remove("hidden"),I()}function F(){document.getElementById("modalFavoritos").classList.add("hidden")}function I(){const t=document.getElementById("listaFavoritos");if(m.length===0){t.innerHTML=`
            <div class="text-center py-8">
                <i class="fas fa-heart text-gray-300 text-4xl mb-3"></i>
                <p class="text-gray-500">No tienes productos favoritos</p>
                <p class="text-sm text-gray-400 mt-1">Visita la tienda para agregar productos a favoritos</p>
            </div>
        `;return}t.innerHTML=m.map(e=>`
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div class="flex items-center space-x-3 flex-1">
                <img src="${e.imagen}" alt="${e.nombre}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm truncate">${e.nombre}</div>
                    <div class="text-xs text-gray-500">$${e.precio.toLocaleString()} • +${e.puntosVerdes} pts</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="irATienda()" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    Comprar
                </button>
                <button onclick="removerFavorito(${e.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join("")}function R(t){const e=m.findIndex(o=>o.id===t);if(e!==-1){const o=m[e];m.splice(e,1),localStorage.setItem("productosFavoritos",JSON.stringify(m)),f(`💔 "${o.nombre}" removido de favoritos`),I()}}function z(){window.location.href="../tienda/tienda.html"}async function J(){try{f("📊 Generando reporte PDF...");const{jsPDF:t}=window.jspdf,e=new t;e.setFont("helvetica"),e.setFontSize(20),e.setTextColor(34,197,94),e.text("Reporte Ecológico - ECO Puntos Verdes",20,30),e.setFontSize(12),e.setTextColor(100,100,100),e.text(`Generado: ${new Date().toLocaleDateString("es-CO")}`,20,45),e.text("Usuario: Juan Pérez",20,55);const o=[{id:"graficoMensualContainer",titulo:"Evolución de Puntos Verdes",y:70},{id:"impactoAmbientalContainer",titulo:"Impacto Ambiental",y:200},{id:"historialComprasContainer",titulo:"Historial de Compras",y:330},{id:"logrosContainer",titulo:"Logros Ecológicos",y:460},{id:"comparativaContainer",titulo:"Comparativa Mensual",y:530}];let a=70;for(const c of o){const l=document.getElementById(c.id);if(l){e.setFontSize(16),e.setTextColor(34,197,94),e.text(c.titulo,20,a),a+=10;const p=await html2canvas(l,{scale:1,useCORS:!0,logging:!1}),u=p.toDataURL("image/jpeg",.7),d=170,h=p.height*d/p.width;e.addImage(u,"JPEG",20,a,d,h),a+=h+20,a>250&&(e.addPage(),a=20)}}e.save(`Reporte_Eco_${new Date().toISOString().split("T")[0]}.pdf`),f("✅ Reporte PDF descargado exitosamente")}catch(t){console.error("Error generando PDF:",t),f("❌ Error al generar el reporte PDF")}}function f(t){const e=document.createElement("div");e.className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-[10000]",e.innerText=t,document.body.appendChild(e),setTimeout(()=>{e.remove()},4e3)}window.addEventListener("focus",()=>{C(),b()});window.toggleUserMenu=j;window.abrirNotificaciones=O;window.cerrarNotificaciones=v;window.abrirCupones=E;window.cerrarCupones=x;window.canjearCupon=T;window.abrirFavoritos=$;window.cerrarFavoritos=F;window.removerFavorito=R;window.irATienda=z;window.exportarPDF=J;
