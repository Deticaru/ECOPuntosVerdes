import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */const c=[{id:1,nombre:"Botella de Agua Reutilizable",precio:15e3,imagen:"https://via.placeholder.com/200x200/22c55e/ffffff?text=Botella+Eco",huellaCarbonoKg:-2.3,puntosVerdes:15,categoria:"Sustentable",descripcion:"Botella de acero inoxidable, libre de BPA"},{id:2,nombre:"Bolsa Ecológica de Tela",precio:8e3,imagen:"https://via.placeholder.com/200x200/16a34a/ffffff?text=Bolsa+Eco",huellaCarbonoKg:-1.2,puntosVerdes:10,categoria:"Sustentable",descripcion:"Bolsa reutilizable de algodón orgánico"},{id:3,nombre:"Panel Solar Portátil",precio:85e3,imagen:"https://via.placeholder.com/200x200/eab308/ffffff?text=Panel+Solar",huellaCarbonoKg:-15.8,puntosVerdes:50,categoria:"Energía Renovable",descripcion:"Panel solar de 20W para dispositivos móviles"},{id:4,nombre:"Compost Orgánico 5kg",precio:12e3,imagen:"https://via.placeholder.com/200x200/84cc16/ffffff?text=Compost",huellaCarbonoKg:-3.5,puntosVerdes:12,categoria:"Jardinería",descripcion:"Compost 100% orgánico para plantas"},{id:5,nombre:"Lámpara LED Solar",precio:25e3,imagen:"https://via.placeholder.com/200x200/f59e0b/ffffff?text=Lampara+LED",huellaCarbonoKg:-8.2,puntosVerdes:25,categoria:"Energía Renovable",descripcion:"Lámpara con panel solar integrado"},{id:6,nombre:"Kit de Reciclaje",precio:18e3,imagen:"https://via.placeholder.com/200x200/059669/ffffff?text=Kit+Reciclaje",huellaCarbonoKg:-4.1,puntosVerdes:20,categoria:"Reciclaje",descripcion:"Kit completo para separar residuos en casa"}],p=[{id:1,numero:"**** **** **** 1234",tipo:"Visa",nombre:"Juan Pérez",vencimiento:"12/27"},{id:2,numero:"**** **** **** 5678",tipo:"Mastercard",nombre:"Juan Pérez",vencimiento:"03/26"}];let a=null,i=parseInt(localStorage.getItem("puntosUsuario"))||180,r=JSON.parse(localStorage.getItem("productosFavoritos"))||[],g=[{id:1,nombre:"10% Descuento Walmart",puntos:50,activo:!0,app:"Walmart"},{id:2,nombre:"5% Descuento EcoPuntos",puntos:20,activo:!0,app:"EcoPuntos"},{id:3,nombre:"15% Descuento Walmart",puntos:100,activo:!1,app:"Walmart"}];document.addEventListener("DOMContentLoaded",()=>{f(),m();const t=document.getElementById("btnCanjearPuntos");t&&t.addEventListener("click",s);const e=document.getElementById("linkCupones");e&&e.addEventListener("click",n=>{n.preventDefault(),s()});const o=document.getElementById("linkFavoritos");o&&o.addEventListener("click",n=>{n.preventDefault(),b()}),L()});function f(){const t=document.getElementById("productosGrid");t.innerHTML=c.map(e=>{const o=r.some(n=>n.id===e.id);return`
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex space-x-4">
                <div class="flex-shrink-0 relative">
                    <img src="${e.imagen}" alt="${e.nombre}" class="w-20 h-20 object-cover rounded-xl border border-gray-200">
                    <button onclick="toggleFavorito(${e.id})" 
                            class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110 ${o?"text-red-500":"text-gray-400"}">
                        <i class="fas fa-heart ${o?"fas":"far"}"></i>
                    </button>
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
    `}).join("")}function h(t){return`${Math.abs(t/22).toFixed(1)} árboles plantados`}window.toggleFavorito=function(t){const e=c.find(n=>n.id===t),o=r.findIndex(n=>n.id===t);o===-1?(r.push(e),l(`❤️ "${e.nombre}" agregado a favoritos`)):(r.splice(o,1),l(`💔 "${e.nombre}" removido de favoritos`)),localStorage.setItem("productosFavoritos",JSON.stringify(r)),f(),document.getElementById("modalFavoritos").classList.contains("hidden")||v()};function b(){document.getElementById("modalFavoritos").classList.remove("hidden"),v()}function d(){document.getElementById("modalFavoritos").classList.add("hidden")}function v(){const t=document.getElementById("listaFavoritos");if(r.length===0){t.innerHTML=`
            <div class="text-center py-8">
                <i class="fas fa-heart text-gray-300 text-4xl mb-3"></i>
                <p class="text-gray-500">No tienes productos favoritos</p>
                <p class="text-sm text-gray-400 mt-1">Haz clic en el corazón de los productos para agregarlos</p>
            </div>
        `;return}t.innerHTML=r.map(e=>`
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div class="flex items-center space-x-3 flex-1">
                <img src="${e.imagen}" alt="${e.nombre}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm truncate">${e.nombre}</div>
                    <div class="text-xs text-gray-500">$${e.precio.toLocaleString()} • +${e.puntosVerdes} pts</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="comprarProducto(${e.id})" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    Comprar
                </button>
                <button onclick="toggleFavorito(${e.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join("")}window.comprarProducto=function(t){a=c.find(e=>e.id===t),w(),d()};function w(){const t=document.getElementById("modalPago"),e=document.getElementById("detalleProducto"),o=document.getElementById("tarjetasDisponibles");e.innerHTML=`
        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border">
            <img src="${a.imagen}" alt="${a.nombre}" class="w-16 h-16 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${a.nombre}</h4>
                <p class="text-gray-600 text-lg">$${a.precio.toLocaleString()}</p>
                <p class="text-green-600 text-sm font-semibold"><i class="fas fa-leaf mr-1"></i> +${a.puntosVerdes} puntos verdes</p>
            </div>
        </div>
    `,o.innerHTML=p.map(n=>`
        <div onclick="seleccionarTarjeta(${n.id})" class="tarjeta-opcion border-2 border-gray-200 rounded-2xl p-4 cursor-pointer mb-3 hover:border-blue-300 transition-colors">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold text-gray-800">${n.tipo}</span>
                    <span class="text-gray-600 ml-2">${n.numero}</span>
                </div>
                <div class="text-sm text-gray-500">${n.vencimiento}</div>
            </div>
        </div>
    `).join(""),t.classList.remove("hidden")}window.seleccionarTarjeta=function(t){p.find(e=>e.id===t),document.querySelectorAll(".tarjeta-opcion").forEach(e=>e.classList.remove("border-blue-500","bg-blue-50")),event.currentTarget.classList.add("border-blue-500","bg-blue-50"),document.getElementById("btnPagar").disabled=!1};window.procesarPago=function(){const t=document.getElementById("btnPagar");t.innerHTML='<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...',t.disabled=!0,setTimeout(()=>{i+=a.puntosVerdes,localStorage.setItem("puntosUsuario",i),y(),C(),cerrarModal()},2e3)};function y(){const t=JSON.parse(localStorage.getItem("historialCompras"))||[];t.push({id:Date.now(),fecha:new Date().toISOString().split("T")[0],producto:a.nombre,precio:a.precio,puntos:a.puntosVerdes,carbono:a.huellaCarbonoKg,categoria:a.categoria}),localStorage.setItem("historialCompras",JSON.stringify(t))}function C(){const t=document.getElementById("modalConfirmacion"),e=document.getElementById("resumenCompra"),o=document.getElementById("impactoAmbiental");e.innerHTML=`
        <h4 class="font-bold mb-2 text-lg">${a.nombre}</h4>
        <p class="text-gray-600 mb-2">Precio: $${a.precio.toLocaleString()}</p>
        <p class="text-green-600 font-bold text-lg">+${a.puntosVerdes} Puntos Verdes! 🎉</p>
    `,o.innerHTML=`
        <div class="text-center">
            <div class="font-semibold text-blue-800 mb-1">🌍 Impacto Ambiental</div>
            <div class="text-lg font-bold text-green-600">-${Math.abs(a.huellaCarbonoKg)} kg CO₂</div>
            <div class="text-sm text-gray-600">${h(a.huellaCarbonoKg)}</div>
        </div>
    `,m(),t.classList.remove("hidden")}function m(){const t=document.getElementById("puntosUsuario");t&&(t.textContent=`${i} Puntos Verdes`)}function $(){window.location.href="../menu/menu.html"}window.cerrarModal=function(){document.getElementById("modalPago").classList.add("hidden"),a=null,document.getElementById("btnPagar").innerHTML="Pagar Ahora",document.getElementById("btnPagar").disabled=!0};window.cerrarConfirmacion=function(){document.getElementById("modalConfirmacion").classList.add("hidden")};function s(){document.getElementById("modalCupones").classList.remove("hidden"),x()}function u(){document.getElementById("modalCupones").classList.add("hidden")}function x(){const t=document.getElementById("listaCupones");t.innerHTML="",g.forEach(e=>{const o=i>=e.puntos&&e.activo;t.innerHTML+=`
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
        `})}function E(t){const e=g.find(o=>o.id===t);if(!e||!e.activo){alert("❌ Este cupón ya no está disponible.");return}if(i<e.puntos){alert("❌ No tienes puntos suficientes para canjear este cupón.");return}i-=e.puntos,localStorage.setItem("puntosUsuario",i),l(`✅ Cupón canjeado: ${e.nombre} (${e.app})`),x(),m(),u()}function l(t){const e=document.createElement("div");e.className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-[10000]",e.innerText=t,document.body.appendChild(e),setTimeout(()=>{e.remove()},4e3)}function L(){["modalCupones","modalFavoritos","modalPago","modalConfirmacion"].forEach(t=>{const e=document.getElementById(t);e&&e.addEventListener("click",o=>{o.target===e&&(t==="modalCupones"&&u(),t==="modalFavoritos"&&d(),t==="modalPago"&&window.cerrarModal(),t==="modalConfirmacion"&&window.cerrarConfirmacion())})})}window.abrirCupones=s;window.cerrarCupones=u;window.canjearCupon=E;window.abrirFavoritos=b;window.cerrarFavoritos=d;window.toggleFavorito=toggleFavorito;window.irAlMenu=$;window.comprarProducto=comprarProducto;window.seleccionarTarjeta=seleccionarTarjeta;window.procesarPago=procesarPago;window.cerrarModal=cerrarModal;window.cerrarConfirmacion=cerrarConfirmacion;
