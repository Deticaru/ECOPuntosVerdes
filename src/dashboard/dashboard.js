// src/dashboard/dashboard.js
import { productos } from '../data/productos.js';

let puntosUsuario = 0;
let historialCompras = [];
let productosFavoritos = JSON.parse(localStorage.getItem('productosFavoritos')) || [];
let datosGraficos = {};

// Datos simulados de cupones (idénticos a menu.js)
let cupones = [
    { id: 1, nombre: '10% Descuento Walmart', puntos: 50, activo: true, app: 'Walmart' },
    { id: 2, nombre: '5% Descuento EcoPuntos', puntos: 20, activo: true, app: 'EcoPuntos' },
    { id: 3, nombre: '15% Descuento Walmart', puntos: 100, activo: false, app: 'Walmart' }
];

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
    configurarEventListeners();
});

function configurarEventListeners() {
    // Link de cupones
    const linkCupones = document.getElementById('linkCupones');
    if (linkCupones) linkCupones.addEventListener('click', (e) => {
        e.preventDefault();
        abrirCupones();
    });

    // Link de favoritos
    const linkFavoritos = document.getElementById('linkFavoritos');
    if (linkFavoritos) linkFavoritos.addEventListener('click', (e) => {
        e.preventDefault();
        abrirFavoritos();
    });

    // Formulario de notificaciones
    const formNotificaciones = document.getElementById('formNotificaciones');
    if (formNotificaciones) {
        formNotificaciones.addEventListener('submit', guardarPreferencias);
    }

    // Configurar cierre de modales al hacer clic fuera
    configurarCierreModales();
}

function configurarCierreModales() {
    // Cerrar modales al hacer clic fuera
    ['modalCupones', 'modalFavoritos', 'modalNotificaciones'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modalId === 'modalCupones') cerrarCupones();
                    if (modalId === 'modalFavoritos') cerrarFavoritos();
                    if (modalId === 'modalNotificaciones') cerrarNotificaciones();
                }
            });
        }
    });
}

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

// ---------- Funciones del Menú Desplegable ----------
function toggleUserMenu() {
    document.getElementById("userMenu").classList.toggle("hidden");
}

function abrirNotificaciones() {
    document.getElementById("modalNotificaciones").classList.remove("hidden");
    document.getElementById("userMenu").classList.add("hidden");
}

function cerrarNotificaciones() {
    document.getElementById("modalNotificaciones").classList.add("hidden");
}

function guardarPreferencias(e) {
    e.preventDefault();
    const preferencias = {
        puntos: this.puntos.checked,
        promociones: this.promociones.checked,
        productos: this.productos.checked,
        habitos: this.habitos.checked
    };
    localStorage.setItem("notificaciones", JSON.stringify(preferencias));
    generarNotificacion("✅ Preferencias guardadas");
    cerrarNotificaciones();
}

// ---------- Funciones de Cupones ----------
function abrirCupones() {
    document.getElementById("modalCupones").classList.remove("hidden");
    cargarCupones();
}

function cerrarCupones() {
    document.getElementById("modalCupones").classList.add("hidden");
}

function cargarCupones() {
    const lista = document.getElementById('listaCupones');
    lista.innerHTML = '';

    cupones.forEach(cupon => {
        const puedeCanjear = puntosUsuario >= cupon.puntos && cupon.activo;
        lista.innerHTML += `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                    <div class="font-semibold">${cupon.nombre}</div>
                    <div class="text-xs text-gray-500">Requiere ${cupon.puntos} puntos • ${cupon.app}</div>
                </div>
                <button ${!puedeCanjear ? 'disabled' : ''} 
                    class="px-3 py-1 rounded-lg text-white ${puedeCanjear ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}"
                    onclick="canjearCupon(${cupon.id})">
                    Canjear
                </button>
            </div>
        `;
    });
}

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
    generarNotificacion(`✅ Cupón canjeado: ${cupon.nombre} (${cupon.app})`);
    cargarCupones();
    inicializarDashboard();
    cerrarCupones();
}

// ---------- Funciones de Favoritos ----------
function abrirFavoritos() {
    document.getElementById("modalFavoritos").classList.remove("hidden");
    cargarFavoritos();
}

function cerrarFavoritos() {
    document.getElementById("modalFavoritos").classList.add("hidden");
}

function cargarFavoritos() {
    const lista = document.getElementById('listaFavoritos');
    
    if (productosFavoritos.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-heart text-gray-300 text-4xl mb-3"></i>
                <p class="text-gray-500">No tienes productos favoritos</p>
                <p class="text-sm text-gray-400 mt-1">Visita la tienda para agregar productos a favoritos</p>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = productosFavoritos.map(producto => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div class="flex items-center space-x-3 flex-1">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm truncate">${producto.nombre}</div>
                    <div class="text-xs text-gray-500">$${producto.precio.toLocaleString()} • +${producto.puntosVerdes} pts</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="irATienda()" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    Comprar
                </button>
                <button onclick="removerFavorito(${producto.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removerFavorito(productId) {
    const index = productosFavoritos.findIndex(fav => fav.id === productId);
    if (index !== -1) {
        const producto = productosFavoritos[index];
        productosFavoritos.splice(index, 1);
        localStorage.setItem('productosFavoritos', JSON.stringify(productosFavoritos));
        generarNotificacion(`💔 "${producto.nombre}" removido de favoritos`);
        cargarFavoritos();
    }
}

function irATienda() {
    window.location.href = '../tienda/tienda.html';
}

// ---------- Función de Exportación PDF ----------
async function exportarPDF() {
    try {
        // Mostrar indicador de carga
        generarNotificacion("📊 Generando reporte PDF...");
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuración inicial
        doc.setFont('helvetica');
        doc.setFontSize(20);
        doc.setTextColor(34, 197, 94); // Verde ECO
        doc.text('Reporte Ecológico - ECO Puntos Verdes', 20, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 20, 45);
        doc.text(`Usuario: Juan Pérez`, 20, 55);
        
        // Capturar y agregar gráficos
        const secciones = [
            { id: 'graficoMensualContainer', titulo: 'Evolución de Puntos Verdes', y: 70 },
            { id: 'impactoAmbientalContainer', titulo: 'Impacto Ambiental', y: 200 },
            { id: 'historialComprasContainer', titulo: 'Historial de Compras', y: 330 },
            { id: 'logrosContainer', titulo: 'Logros Ecológicos', y: 460 },
            { id: 'comparativaContainer', titulo: 'Comparativa Mensual', y: 530 }
        ];
        
        let currentY = 70;
        
        for (const seccion of secciones) {
            const elemento = document.getElementById(seccion.id);
            if (elemento) {
                // Agregar título de sección
                doc.setFontSize(16);
                doc.setTextColor(34, 197, 94);
                doc.text(seccion.titulo, 20, currentY);
                currentY += 10;
                
                // Capturar imagen de la sección
                const canvas = await html2canvas(elemento, {
                    scale: 1,
                    useCORS: true,
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.7);
                
                // Calcular dimensiones para mantener proporción
                const imgWidth = 170;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Agregar imagen al PDF
                doc.addImage(imgData, 'JPEG', 20, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 20;
                
                // Agregar nueva página si es necesario
                if (currentY > 250) {
                    doc.addPage();
                    currentY = 20;
                }
            }
        }
        
        // Guardar PDF
        doc.save(`Reporte_Eco_${new Date().toISOString().split('T')[0]}.pdf`);
        
        generarNotificacion("✅ Reporte PDF descargado exitosamente");
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        generarNotificacion("❌ Error al generar el reporte PDF");
    }
}

// ---------- Función de Notificación ----------
function generarNotificacion(mensaje) {
    // Crear elemento de notificación
    const noti = document.createElement("div");
    noti.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-[10000]";
    noti.innerText = mensaje;
    document.body.appendChild(noti);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        noti.remove();
    }, 4000);
}

// Actualizar al recibir foco de la ventana
window.addEventListener('focus', () => {
    cargarDatosUsuario();
    inicializarDashboard();
});

// Exponer funciones globalmente
window.toggleUserMenu = toggleUserMenu;
window.abrirNotificaciones = abrirNotificaciones;
window.cerrarNotificaciones = cerrarNotificaciones;
window.abrirCupones = abrirCupones;
window.cerrarCupones = cerrarCupones;
window.canjearCupon = canjearCupon;
window.abrirFavoritos = abrirFavoritos;
window.cerrarFavoritos = cerrarFavoritos;
window.removerFavorito = removerFavorito;
window.irATienda = irATienda;
window.exportarPDF = exportarPDF;
