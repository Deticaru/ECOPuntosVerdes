import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */const d=[{id:1,nombre:"Botella de Agua Reutilizable",precio:15e3,imagen:"https://via.placeholder.com/200x200/22c55e/ffffff?text=Botella+Eco",huellaCarbonoKg:-2.3,puntosVerdes:15,categoria:"Sustentable",descripcion:"Botella de acero inoxidable, libre de BPA"},{id:2,nombre:"Bolsa Ecológica de Tela",precio:8e3,imagen:"https://via.placeholder.com/200x200/16a34a/ffffff?text=Bolsa+Eco",huellaCarbonoKg:-1.2,puntosVerdes:10,categoria:"Sustentable",descripcion:"Bolsa reutilizable de algodón orgánico"},{id:3,nombre:"Panel Solar Portátil",precio:85e3,imagen:"https://via.placeholder.com/200x200/eab308/ffffff?text=Panel+Solar",huellaCarbonoKg:-15.8,puntosVerdes:50,categoria:"Energía Renovable",descripcion:"Panel solar de 20W para dispositivos móviles"},{id:4,nombre:"Compost Orgánico 5kg",precio:12e3,imagen:"https://via.placeholder.com/200x200/84cc16/ffffff?text=Compost",huellaCarbonoKg:-3.5,puntosVerdes:12,categoria:"Jardinería",descripcion:"Compost 100% orgánico para plantas"},{id:5,nombre:"Lámpara LED Solar",precio:25e3,imagen:"https://via.placeholder.com/200x200/f59e0b/ffffff?text=Lampara+LED",huellaCarbonoKg:-8.2,puntosVerdes:25,categoria:"Energía Renovable",descripcion:"Lámpara con panel solar integrado"},{id:6,nombre:"Kit de Reciclaje",precio:18e3,imagen:"https://via.placeholder.com/200x200/059669/ffffff?text=Kit+Reciclaje",huellaCarbonoKg:-4.1,puntosVerdes:20,categoria:"Reciclaje",descripcion:"Kit completo para separar residuos en casa"}],l=[{id:1,numero:"**** **** **** 1234",tipo:"Visa",nombre:"Juan Pérez",vencimiento:"12/27"},{id:2,numero:"**** **** **** 5678",tipo:"Mastercard",nombre:"Juan Pérez",vencimiento:"03/26"}];let o=null,r=parseInt(localStorage.getItem("puntosUsuario"))||180;const c=[{id:1,nombre:"5% Descuento",puntos:10,activo:!0,app:"EcoPuntos Verdes"},{id:2,nombre:"10% Walmart",puntos:25,activo:!0,app:"Walmart"},{id:3,nombre:"Envío Gratis",puntos:15,activo:!1,app:"EcoPuntos Verdes"}];document.addEventListener("DOMContentLoaded",()=>{u(),i();const t=document.getElementById("btnCanjearPuntos");t&&t.addEventListener("click",s);const e=document.getElementById("linkCupones");e&&e.addEventListener("click",n=>{n.preventDefault(),s()})});function u(){const t=document.getElementById("productosGrid");t.innerHTML=d.map(e=>`
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex space-x-4">
                <div class="flex-shrink-0">
                    <img src="${e.imagen}" alt="${e.nombre}" class="w-20 h-20 object-cover rounded-xl border border-gray-200">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 text-lg mb-1 truncate">${e.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${e.descripcion}</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-green-600 text-xl font-bold">$${e.precio.toLocaleString()}</span>
                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">+${e.puntosVerdes} pts</span>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center text-blue-600 text-sm">
                            <i class="fas fa-leaf mr-1"></i>
                            <span>-${Math.abs(e.huellaCarbonoKg)} kg CO₂</span>
                        </div>
                        <span class="text-gray-500 text-sm">${e.categoria}</span>
                    </div>
                    <button onclick="comprarProducto(${e.id})" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-colors shadow-sm">
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    `).join("")}function p(t){return`${Math.abs(t/22).toFixed(1)} árboles plantados`}window.comprarProducto=function(t){o=d.find(e=>e.id===t),g()};function g(){const t=document.getElementById("modalPago"),e=document.getElementById("detalleProducto"),n=document.getElementById("tarjetasDisponibles");e.innerHTML=`
        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border">
            <img src="${o.imagen}" alt="${o.nombre}" class="w-16 h-16 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${o.nombre}</h4>
                <p class="text-gray-600 text-lg">$${o.precio.toLocaleString()}</p>
                <p class="text-green-600 text-sm font-semibold"><i class="fas fa-leaf mr-1"></i> +${o.puntosVerdes} puntos verdes</p>
            </div>
        </div>
    `,n.innerHTML=l.map(a=>`
        <div onclick="seleccionarTarjeta(${a.id})" class="tarjeta-opcion border-2 border-gray-200 rounded-2xl p-4 cursor-pointer mb-3 hover:border-blue-300 transition-colors">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold text-gray-800">${a.tipo}</span>
                    <span class="text-gray-600 ml-2">${a.numero}</span>
                </div>
                <div class="text-sm text-gray-500">${a.vencimiento}</div>
            </div>
        </div>
    `).join(""),t.classList.remove("hidden")}window.seleccionarTarjeta=function(t){l.find(e=>e.id===t),document.querySelectorAll(".tarjeta-opcion").forEach(e=>e.classList.remove("border-blue-500","bg-blue-50")),event.currentTarget.classList.add("border-blue-500","bg-blue-50"),document.getElementById("btnPagar").disabled=!1};window.procesarPago=function(){const t=document.getElementById("btnPagar");t.innerHTML='<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...',t.disabled=!0,setTimeout(()=>{r+=o.puntosVerdes,localStorage.setItem("puntosUsuario",r),b(),f(),cerrarModal()},2e3)};function b(){const t=JSON.parse(localStorage.getItem("historialCompras"))||[];t.push({id:Date.now(),fecha:new Date().toISOString().split("T")[0],producto:o.nombre,precio:o.precio,puntos:o.puntosVerdes,carbono:o.huellaCarbonoKg,categoria:o.categoria}),localStorage.setItem("historialCompras",JSON.stringify(t))}function f(){const t=document.getElementById("modalConfirmacion"),e=document.getElementById("resumenCompra"),n=document.getElementById("impactoAmbiental");e.innerHTML=`
        <h4 class="font-bold mb-2 text-lg">${o.nombre}</h4>
        <p class="text-gray-600 mb-2">Precio: $${o.precio.toLocaleString()}</p>
        <p class="text-green-600 font-bold text-lg">+${o.puntosVerdes} Puntos Verdes! 🎉</p>
    `,n.innerHTML=`
        <div class="text-center">
            <div class="font-semibold text-blue-800 mb-1">🌍 Impacto Ambiental</div>
            <div class="text-lg font-bold text-green-600">-${Math.abs(o.huellaCarbonoKg)} kg CO₂</div>
            <div class="text-sm text-gray-600">${p(o.huellaCarbonoKg)}</div>
        </div>
    `,i(),t.classList.remove("hidden")}function i(){document.getElementById("puntosUsuario").textContent=`${r} Puntos Verdes`}window.cerrarModal=function(){document.getElementById("modalPago").classList.add("hidden"),o=null,document.getElementById("btnPagar").innerHTML="Pagar Ahora",document.getElementById("btnPagar").disabled=!0};window.cerrarConfirmacion=function(){document.getElementById("modalConfirmacion").classList.add("hidden")};function s(){document.getElementById("modalCupones").classList.remove("hidden"),m()}function v(){document.getElementById("modalCupones").classList.add("hidden")}function x(t){const e=c.find(n=>n.id===t);if(!e||!e.activo){alert("❌ Este cupón ya no está disponible.");return}if(r<e.puntos){alert("❌ No tienes puntos suficientes para canjear este cupón.");return}r-=e.puntos,localStorage.setItem("puntosUsuario",r),alert(`✅ Cupón canjeado: ${e.nombre} (${e.app})`),m(),i()}function m(){const t=document.getElementById("listaCupones");t.innerHTML="",c.forEach(e=>{const n=r<e.puntos||!e.activo?"disabled opacity-50 cursor-not-allowed":"",a=document.createElement("div");a.className="flex justify-between items-center p-3 bg-gray-50 rounded-lg",a.innerHTML=`
            <div>
                <div class="font-semibold">${e.nombre}</div>
                <div class="text-xs text-gray-500">${e.puntos} puntos - ${e.app}</div>
            </div>
            <button class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 ${n}" 
                ${n?"disabled":""} 
                onclick="canjearCupon(${e.id})">
                Canjear
            </button>
        `,t.appendChild(a)})}window.cerrarModal=function(){document.getElementById("modalPago").classList.add("hidden"),o=null,document.getElementById("btnPagar").innerHTML="Pagar Ahora",document.getElementById("btnPagar").disabled=!0};window.cerrarConfirmacion=function(){document.getElementById("modalConfirmacion").classList.add("hidden")};window.cerrarCupones=function(){document.getElementById("modalCupones").classList.add("hidden")};function h(t){const e=document.getElementById(t);e.addEventListener("click",n=>{n.target===e&&e.classList.add("hidden")})}["modalPago","modalConfirmacion","modalCupones"].forEach(t=>h(t));window.abrirCupones=s;window.cerrarCupones=v;window.canjearCupon=x;
