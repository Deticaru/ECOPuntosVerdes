import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */let s=0,i=[],d=null;function f(){const e=document.getElementById("settingsMenu");e&&e.classList.toggle("hidden")}window.toggleSettingsMenu=f;document.addEventListener("DOMContentLoaded",()=>{l(),c(),u(),m();const e=document.getElementById("btnNotificaciones");e&&e.addEventListener("click",b)});function l(){s=parseInt(localStorage.getItem("puntosUsuario"))||123,i=JSON.parse(localStorage.getItem("historialCompras"))||[],i.length===0&&(i=[{id:1,fecha:"2024-09-15",producto:"Botella Reutilizable",precio:15e3,puntos:15,carbono:-2.3,categoria:"Sustentable"},{id:2,fecha:"2024-09-20",producto:"Panel Solar Portátil",precio:85e3,puntos:50,carbono:-15.8,categoria:"Energía Renovable"}])}function c(){const e=s,t=i.reduce((o,a)=>o+Math.abs(a.carbono),0),n=i.length;document.getElementById("totalPuntos").textContent=e,document.getElementById("carbonoEvitado").textContent=t.toFixed(1),document.getElementById("totalCompras").textContent=n,v(t)}function v(e){const t=document.getElementById("metricasImpacto"),n=(e*4.6).toFixed(0),o=(e/22).toFixed(1);t.innerHTML=`
        <div class="text-center p-3 bg-red-50 rounded-lg">
            <i class="fas fa-car text-red-500 text-xl mb-1"></i>
            <div class="font-bold">${n} km</div>
            <div class="text-xs text-gray-600">Auto no usado</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
            <i class="fas fa-tree text-green-500 text-xl mb-1"></i>
            <div class="font-bold">${o}</div>
            <div class="text-xs text-gray-600">Árboles equiv.</div>
        </div>
    `}function u(){const e=document.getElementById("graficoMensual").getContext("2d"),t=["Jul","Ago","Sep","Oct"],n=[0,25,65,s];d=new Chart(e,{type:"line",data:{labels:t,datasets:[{label:"Puntos",data:n,borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:2,fill:!0,tension:.4,pointRadius:3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,display:!1},x:{display:!0,ticks:{font:{size:10}}}}}})}function m(){const e=document.getElementById("historialCompras"),t=document.getElementById("sinCompras");if(i.length===0){e.style.display="none",t.classList.remove("hidden");return}t.classList.add("hidden"),e.style.display="block";const n=i.slice(-3);e.innerHTML=n.map(o=>{const a=new Date(o.fecha).toLocaleDateString("es-ES",{day:"numeric",month:"short"});return`
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div class="flex items-center">
                    <div class="bg-green-100 rounded-lg p-2 mr-3">
                        <i class="fas fa-leaf text-green-600"></i>
                    </div>
                    <div>
                        <div class="font-semibold text-sm">${o.producto}</div>
                        <div class="text-xs text-gray-500">${a}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-green-600 font-bold text-sm">+${o.puntos}</div>
                    <div class="text-xs text-gray-500">$${(o.precio/1e3).toFixed(0)}k</div>
                </div>
            </div>
        `}).join("")}document.addEventListener("click",function(e){const t=document.getElementById("settingsMenu"),n=e.target.closest('button[onclick*="toggleSettingsMenu"]');t&&!n&&!t.contains(e.target)&&t.classList.add("hidden")});function b(){document.getElementById("modalNotificaciones").classList.remove("hidden")}function r(){document.getElementById("modalNotificaciones").classList.add("hidden")}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("modalNotificaciones");e&&e.addEventListener("click",n=>{n.target.id==="modalNotificaciones"&&r()});const t=document.getElementById("formNotificaciones");t&&t.addEventListener("submit",n=>{n.preventDefault(),alert("✅ Preferencias de notificaciones guardadas."),r()})});window.addEventListener("focus",()=>{l(),c(),d&&(d.destroy(),u()),m()});const g=[{id:1,nombre:"5% Descuento",puntos:10,activo:!0,app:"EcoPuntos Verdes"},{id:2,nombre:"10% Walmart",puntos:25,activo:!0,app:"Walmart"},{id:3,nombre:"Envío Gratis",puntos:15,activo:!1,app:"EcoPuntos Verdes"}];function x(e){const t=g.find(n=>n.id===e);if(!t||!t.activo){alert("❌ Este cupón ya no está disponible.");return}if(s<t.puntos){alert("❌ No tienes puntos suficientes para canjear este cupón.");return}s-=t.puntos,localStorage.setItem("puntosUsuario",s),alert(`✅ Cupón canjeado: ${t.nombre} (${t.app})`),p(),c()}function y(){document.getElementById("modalCupones").classList.remove("hidden"),p()}function p(){const e=document.getElementById("listaCupones");e.innerHTML="",g.forEach(t=>{const n=document.createElement("div");n.className="flex justify-between items-center p-3 bg-gray-50 rounded-lg";const o=document.createElement("button");o.textContent="Canjear",o.className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600",s<t.puntos||!t.activo?(o.disabled=!0,o.classList.add("opacity-50","cursor-not-allowed")):o.addEventListener("click",()=>x(t.id)),n.innerHTML=`
            <div>
                <div class="font-semibold">${t.nombre}</div>
                <div class="text-xs text-gray-500">${t.puntos} puntos - ${t.app}</div>
            </div>
        `,n.appendChild(o),e.appendChild(n)})}document.getElementById("btnCupones").addEventListener("click",y);
