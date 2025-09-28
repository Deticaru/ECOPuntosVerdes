// src/dashboard/dashboard.js
let puntosUsuario = 0;
let historialCompras = [];
let graficoMensual = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarEstadisticas();
    crearGraficoMensual();
    cargarHistorial();
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

window.addEventListener('focus', () => {
    cargarDatos();
    actualizarEstadisticas();
    if (graficoMensual) {
        graficoMensual.destroy();
        crearGraficoMensual();
    }
    cargarHistorial();
});