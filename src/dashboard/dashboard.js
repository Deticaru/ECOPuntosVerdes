// src/dashboard/dashboard.js
let puntosUsuario = 0;
let historialCompras = [];
let graficoMensual = null;

// ⚙️ Función del dropdown de configuración (debe estar en scope global)
function toggleSettingsMenu() {
    const menu = document.getElementById("settingsMenu");
    if (menu) {
        menu.classList.toggle("hidden");
    }
}

// Asegurar que la función esté en el scope global
window.toggleSettingsMenu = toggleSettingsMenu;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarEstadisticas();
    crearGraficoMensual();
    cargarHistorial();

    // 🔔 Enganchar la campana para abrir el modal de notificaciones
    const btnNotificaciones = document.getElementById("btnNotificaciones");
    if (btnNotificaciones) {
        btnNotificaciones.addEventListener("click", abrirNotificaciones);
    }
});

function cargarDatos() {
    puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 123;
    historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    
    if (historialCompras.length === 0) {
        historialCompras = [
            {
                id: 1,
                fecha: '2024-09-15',
                producto: 'Botella Reutilizable',
                precio: 15000,
                puntos: 15,
                carbono: -2.3,
                categoria: 'Sustentable'
            },
            {
                id: 2,
                fecha: '2024-09-20',
                producto: 'Panel Solar Portátil',
                precio: 85000,
                puntos: 50,
                carbono: -15.8,
                categoria: 'Energía Renovable'
            }
        ];
    }
}

function actualizarEstadisticas() {
    const totalPuntos = puntosUsuario;
    const carbonoTotal = historialCompras.reduce((sum, compra) => sum + Math.abs(compra.carbono), 0);
    const totalCompras = historialCompras.length;

    document.getElementById('totalPuntos').textContent = totalPuntos;
    document.getElementById('carbonoEvitado').textContent = carbonoTotal.toFixed(1);
    document.getElementById('totalCompras').textContent = totalCompras;

    actualizarMetricasImpacto(carbonoTotal);
}

function actualizarMetricasImpacto(carbonoTotal) {
    const metricas = document.getElementById('metricasImpacto');
    const kmAuto = (carbonoTotal * 4.6).toFixed(0);
    const arboles = (carbonoTotal / 22).toFixed(1);
    
    metricas.innerHTML = `
        <div class="text-center p-3 bg-red-50 rounded-lg">
            <i class="fas fa-car text-red-500 text-xl mb-1"></i>
            <div class="font-bold">${kmAuto} km</div>
            <div class="text-xs text-gray-600">Auto no usado</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
            <i class="fas fa-tree text-green-500 text-xl mb-1"></i>
            <div class="font-bold">${arboles}</div>
            <div class="text-xs text-gray-600">Árboles equiv.</div>
        </div>
    `;
}

function crearGraficoMensual() {
    const ctx = document.getElementById('graficoMensual').getContext('2d');
    
    const meses = ['Jul', 'Ago', 'Sep', 'Oct'];
    const puntosAcumulados = [0, 25, 65, puntosUsuario];
    
    graficoMensual = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Puntos',
                data: puntosAcumulados,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    display: false
                },
                x: { 
                    display: true,
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

function cargarHistorial() {
    const historial = document.getElementById('historialCompras');
    const sinCompras = document.getElementById('sinCompras');
    
    if (historialCompras.length === 0) {
        historial.style.display = 'none';
        sinCompras.classList.remove('hidden');
        return;
    }
    
    sinCompras.classList.add('hidden');
    historial.style.display = 'block';
    
    const comprasRecientes = historialCompras.slice(-3);
    
    historial.innerHTML = comprasRecientes.map(compra => {
        const fecha = new Date(compra.fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div class="flex items-center">
                    <div class="bg-green-100 rounded-lg p-2 mr-3">
                        <i class="fas fa-leaf text-green-600"></i>
                    </div>
                    <div>
                        <div class="font-semibold text-sm">${compra.producto}</div>
                        <div class="text-xs text-gray-500">${fecha}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-green-600 font-bold text-sm">+${compra.puntos}</div>
                    <div class="text-xs text-gray-500">$${(compra.precio/1000).toFixed(0)}k</div>
                </div>
            </div>
        `;
    }).join('');
}

// Cerrar el dropdown cuando se hace clic fuera
document.addEventListener('click', function(e) {
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsButton = e.target.closest('button[onclick*="toggleSettingsMenu"]');
    
    if (settingsMenu && !settingsButton && !settingsMenu.contains(e.target)) {
        settingsMenu.classList.add('hidden');
    }
});

// 🔔 Funciones del modal de notificaciones
function abrirNotificaciones() {
    document.getElementById("modalNotificaciones").classList.remove("hidden");
}

function cerrarNotificaciones() {
    document.getElementById("modalNotificaciones").classList.add("hidden");
}

// Cerrar si se hace clic fuera del modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalNotificaciones");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target.id === "modalNotificaciones") {
                cerrarNotificaciones();
            }
        });
    }

    const form = document.getElementById("formNotificaciones");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("✅ Preferencias de notificaciones guardadas.");
            cerrarNotificaciones();
        });
    }
});

window.addEventListener('focus', () => {
    cargarDatos();
    actualizarEstadisticas();
    if (graficoMensual) {
        graficoMensual.destroy();
        crearGraficoMensual();
    }
    cargarHistorial();
});
// Datos de cupones de prueba
const cupones = [
    { id: 1, nombre: "5% Descuento", puntos: 10, activo: true, app: "EcoPuntos Verdes" },
    { id: 2, nombre: "10% Walmart", puntos: 25, activo: true, app: "Walmart" },
    { id: 3, nombre: "Envío Gratis", puntos: 15, activo: false, app: "EcoPuntos Verdes" }
];

// Canjear cupón
function canjearCupon(id) {
    const cupon = cupones.find(c => c.id === id);
    if (!cupon || !cupon.activo) {
        alert("❌ Este cupón ya no está disponible.");
        return;
    }
    if (puntosUsuario < cupon.puntos) {
        alert("❌ No tienes puntos suficientes para canjear este cupón.");
        return;
    }

    puntosUsuario -= cupon.puntos;
    localStorage.setItem('puntosUsuario', puntosUsuario);
    alert(`✅ Cupón canjeado: ${cupon.nombre} (${cupon.app})`);
    cargarCupones();
    actualizarEstadisticas();
}

// Abrir modal de cupones
function abrirCupones() {
    document.getElementById("modalCupones").classList.remove("hidden");
    cargarCupones();
}

// Cerrar modal de cupones
function cerrarCupones() {
    document.getElementById("modalCupones").classList.add("hidden");
}

// Cargar lista de cupones en el modal (versión moderna)
function cargarCupones() {
    const lista = document.getElementById("listaCupones");
    lista.innerHTML = "";

    cupones.forEach(c => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-3 bg-gray-50 rounded-lg";

        const btn = document.createElement("button");
        btn.textContent = "Canjear";
        btn.className = "px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600";

        if (puntosUsuario < c.puntos || !c.activo) {
            btn.disabled = true;
            btn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            btn.addEventListener("click", () => canjearCupon(c.id));
        }

        div.innerHTML = `
            <div>
                <div class="font-semibold">${c.nombre}</div>
                <div class="text-xs text-gray-500">${c.puntos} puntos - ${c.app}</div>
            </div>
        `;
        div.appendChild(btn);
        lista.appendChild(div);
    });
}

// Botón para abrir modal
document.getElementById('btnCupones').addEventListener('click', abrirCupones);
