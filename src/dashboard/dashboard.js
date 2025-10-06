// src/dashboard/dashboard.js
import { productos } from '../data/productos.js';

let puntosUsuario = 0;
let historialCompras = [];
let datosGraficos = {};

// Función para formatear números con coma decimal
function formatearNumero(numero) {
    return numero.toString().replace('.', ',');
}

// Función para obtener fecha actual formateada
function obtenerFechaActual() {
    const fecha = new Date();
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

// Datos específicos para los gráficos
const datosEspecificos = {
    meses: ['Julio', 'Agosto', 'Septiembre', 'Octubre'],
    años: [2025],
    puntosPorMes: [85, 92, 156, 123],
    impactoPorMes: [3.2, 4.1, 7.8, 5.8],
    categorias: ['Productos Reutilizables', 'Energía Renovable', 'Alimentación Orgánica', 'Transporte Ecológico'],
    porcentajesImpacto: [35, 28, 22, 15]
};

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    inicializarDashboard();
    crearGraficos();
});

function cargarDatosUsuario() {
    puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 123;
    historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    
    // Datos por defecto si no hay historial
    if (historialCompras.length === 0) {
        historialCompras = [
            {
                id: 1,
                fecha: '2025-10-15',
                producto: 'Botella de Agua Reutilizable',
                precio: 15000,
                puntos: 15,
                carbono: -2.3,
                categoria: 'Sustentable'
            },
            {
                id: 2,
                fecha: '2025-10-08',
                producto: 'Panel Solar Portátil',
                precio: 85000,
                puntos: 50,
                carbono: -15.8,
                categoria: 'Energía Renovable'
            }
        ];
        localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
    }
}

function inicializarDashboard() {
    // Actualizar fecha actual
    document.getElementById('periodoActual').textContent = `Período: ${obtenerFechaActual()}`;
    document.getElementById('graficoFechas').textContent = `${datosEspecificos.meses[0]} - ${datosEspecificos.meses[datosEspecificos.meses.length - 1]} ${datosEspecificos.años[0]}`;
    
    // Calcular estadísticas
    const carbonoTotal = historialCompras.reduce((sum, compra) => sum + Math.abs(compra.carbono), 0);
    const arbolesEquiv = carbonoTotal / 22;
    const ahorroTotal = historialCompras.reduce((sum, compra) => sum + (compra.precio * 0.15), 0);
    
    // Actualizar elementos con formato correcto
    actualizarElemento('totalPuntos', puntosUsuario);
    actualizarElemento('carbonoEvitado', formatearNumero(carbonoTotal.toFixed(1)));
    actualizarElemento('totalCompras', historialCompras.length);
    actualizarElemento('ahorroTotal', `$${ahorroTotal.toLocaleString('es-CO')}`);
    
    // Stats del gráfico
    const promedioMensual = datosEspecificos.puntosPorMes.reduce((a, b) => a + b, 0) / datosEspecificos.puntosPorMes.length;
    const mesAnterior = datosEspecificos.puntosPorMes[datosEspecificos.puntosPorMes.length - 2];
    const mesActual = datosEspecificos.puntosPorMes[datosEspecificos.puntosPorMes.length - 1];
    const crecimiento = ((mesActual - mesAnterior) / mesAnterior) * 100;
    
    actualizarElemento('puntosMesActual', mesActual);
    actualizarElemento('promedioMensual', formatearNumero(promedioMensual.toFixed(1)));
    actualizarElemento('crecimientoMensual', `${crecimiento > 0 ? '+' : ''}${formatearNumero(crecimiento.toFixed(1))}%`);
    
    // Métricas de impacto
    actualizarElemento('co2Evitado', formatearNumero(carbonoTotal.toFixed(1)));
    actualizarElemento('arbolesEquiv', formatearNumero(arbolesEquiv.toFixed(2)));
    actualizarElemento('aguaAhorrada', formatearNumero((carbonoTotal * 21.6).toFixed(1)));
    actualizarElemento('residuosReducidos', formatearNumero((carbonoTotal * 0.4).toFixed(1)));
    
    // Cargar historial
    cargarHistorialCompras();
}

function actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor;
    }
}

function cargarHistorialCompras() {
    const container = document.getElementById('historialCompras');
    const sinCompras = document.getElementById('sinCompras');
    
    if (historialCompras.length === 0) {
        container.classList.add('hidden');
        sinCompras.classList.remove('hidden');
        return;
    }
    
    container.innerHTML = historialCompras.map(compra => {
        const fecha = new Date(compra.fecha).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const impactoColor = compra.carbono < 0 ? 'text-green-600' : 'text-red-600';
        const impactoIcono = compra.carbono < 0 ? 'fa-leaf' : 'fa-exclamation-triangle';
        
        return `
            <div class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 text-lg">${compra.producto}</h4>
                        <p class="text-sm text-gray-600">${fecha}</p>
                        <div class="flex items-center space-x-4 mt-2">
                            <span class="text-sm text-gray-600">Categoría: <strong>${compra.categoria}</strong></span>
                            <span class="text-sm text-green-600">+${compra.puntos} puntos</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-xl text-gray-800">$${compra.precio.toLocaleString('es-CO')}</div>
                        <div class="text-sm ${impactoColor} flex items-center justify-end mt-1">
                            <i class="fas ${impactoIcono} mr-1"></i>
                            ${formatearNumero(Math.abs(compra.carbono).toFixed(1))} kg CO₂
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Impacto ambiental:</span>
                        <span class="${impactoColor} font-semibold">
                            ${compra.carbono < 0 ? 'Reducción' : 'Emisión'} de ${formatearNumero(Math.abs(compra.carbono).toFixed(1))} kg CO₂
                        </span>
                    </div>
                    <div class="flex justify-between text-sm mt-1">
                        <span class="text-gray-600">Equivalencia forestal:</span>
                        <span class="text-blue-600 font-semibold">${formatearNumero((Math.abs(compra.carbono) / 22).toFixed(3))} árboles</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function crearGraficos() {
    crearGraficoMensual();
    crearGraficoImpacto();
    crearGraficoComparativo();
}

function crearGraficoMensual() {
    const ctx = document.getElementById('graficoMensual').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datosEspecificos.meses,
            datasets: [{
                label: 'Puntos Verdes Ganados',
                data: datosEspecificos.puntosPorMes,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Evolución de Puntos Ecológicos - ${datosEspecificos.años[0]}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valor = formatearNumero(context.parsed.y);
                            const porcentaje = ((context.parsed.y / 150) * 100).toFixed(1);
                            return `Puntos: ${valor} (${formatearNumero(porcentaje)}% de la meta)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    ticks: {
                        callback: function(value) {
                            return formatearNumero(value) + ' pts';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Puntos Verdes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses - 2025'
                    }
                }
            }
        }
    });
}

function crearGraficoImpacto() {
    const ctx = document.getElementById('graficoImpacto').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: datosEspecificos.categorias,
            datasets: [{
                data: datosEspecificos.porcentajesImpacto,
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución del Impacto Ambiental por Categoría',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const porcentaje = formatearNumero(context.parsed);
                            return `${context.label}: ${porcentaje}%`;
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoComparativo() {
    const ctx = document.getElementById('graficoComparativo').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datosEspecificos.meses,
            datasets: [
                {
                    label: 'Puntos Ganados',
                    data: datosEspecificos.puntosPorMes,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1
                },
                {
                    label: 'CO₂ Evitado (kg)',
                    data: datosEspecificos.impactoPorMes,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativa Mensual: Puntos vs Impacto Ambiental',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valor = formatearNumero(context.parsed.y);
                            const unidad = context.datasetIndex === 0 ? ' puntos' : ' kg CO₂';
                            return `${context.dataset.label}: ${valor}${unidad}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Puntos Verdes'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatearNumero(value);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CO₂ Evitado (kg)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatearNumero(value);
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses - 2025'
                    }
                }
            }
        }
    });
}

// Actualizar al recibir foco de la ventana
window.addEventListener('focus', () => {
    cargarDatosUsuario();
    inicializarDashboard();
});