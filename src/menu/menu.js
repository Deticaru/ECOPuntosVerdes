// menu.js - Funcionalidades completas para ECO Puntos Verdes

// ---------- Variables Globales ----------
let puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 123;
let productosFavoritos = JSON.parse(localStorage.getItem('productosFavoritos')) || [];
let userMenuOpen = false;
let stream = null;

// Datos simulados de cupones
let cupones = [
    { id: 1, nombre: '10% Descuento Walmart', puntos: 50, activo: true, app: 'Walmart' },
    { id: 2, nombre: '5% Descuento EcoPuntos', puntos: 20, activo: true, app: 'EcoPuntos' },
    { id: 3, nombre: '15% Descuento Walmart', puntos: 100, activo: false, app: 'Walmart' }
];

// ---------- Utilidades de Formato Chileno ----------
function formatearNumero(numero) {
    if (numero === null || numero === undefined) return '0';
    
    // Convertir a número si es string
    const num = typeof numero === 'string' ? parseFloat(numero.replace(',', '.')) : numero;
    
    if (isNaN(num)) return '0';
    
    // Para números enteros
    if (Number.isInteger(num)) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Para números decimales
    const partes = num.toString().split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(',');
}

function formatearDecimal(numero, decimales = 1) {
    if (numero === null || numero === undefined) return '0';
    
    const num = typeof numero === 'string' ? parseFloat(numero.replace(',', '.')) : numero;
    
    if (isNaN(num)) return '0';
    
    const partes = num.toFixed(decimales).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(',');
}

function formatearMoneda(monto) {
    if (monto === null || monto === undefined) return '$0';
    
    const num = typeof monto === 'string' ? parseFloat(monto.replace(',', '.')) : monto;
    
    if (isNaN(num)) return '$0';
    
    if (Number.isInteger(num)) {
        return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }
    
    const partes = num.toFixed(0).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `$${partes[0]}`;
}

// ---------- Inicialización ----------
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    configurarEventListeners();
    cargarPreferenciasGuardadas();
    actualizarMetricasAmbientales();
});

function inicializarApp() {
    // Actualizar puntos en la UI
    actualizarPuntosUI();
    
    // Configurar formularios
    const formNotificaciones = document.getElementById("formNotificaciones");
    if (formNotificaciones) {
        formNotificaciones.addEventListener("submit", guardarPreferencias);
    }
}

function configurarEventListeners() {
    // Configurar cierre de modales al hacer clic fuera
    configurarCierreModales();
    
    // Configurar tecla Escape para cerrar modales
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });
}

function configurarCierreModales() {
    const modales = [
        'modalNotificaciones', 'modalCupones', 'modalCanjear', 'modalLectorQR',
        'modalCalculadoraHuella', 'modalHistorialEscaneos', 'modalEstadisticas',
        'modalDetallesPedido', 'modalAyuda', 'modalMapaEcoPuntos', 'modalFavoritos'
    ];
    
    modales.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cerrarModalPorId(modalId);
                }
            });
        }
    });
}

// ---------- Gestión del Menú de Usuario ----------
function toggleUserMenu() {
    const userMenu = document.getElementById("userMenu");
    const button = document.querySelector('[aria-controls="userMenu"]');
    
    userMenu.classList.toggle("hidden");
    userMenuOpen = !userMenuOpen;
    
    // Actualizar atributos ARIA para accesibilidad
    if (button) {
        button.setAttribute('aria-expanded', userMenuOpen.toString());
    }
    
    // Si el menú se abre, configurar el event listener para cerrar al hacer clic fuera
    if (userMenuOpen) {
        setTimeout(() => {
            document.addEventListener('click', closeUserMenuOnClickOutside);
        }, 10);
    } else {
        document.removeEventListener('click', closeUserMenuOnClickOutside);
    }
}

function closeUserMenuOnClickOutside(event) {
    const userMenu = document.getElementById("userMenu");
    const userButton = document.querySelector('[aria-controls="userMenu"]');
    
    // Si el clic fue fuera del menú y del botón, cerrar el menú
    if (userMenu && userButton && 
        !userMenu.contains(event.target) && 
        !userButton.contains(event.target)) {
        
        userMenu.classList.add("hidden");
        userMenuOpen = false;
        
        // Actualizar ARIA
        if (userButton) {
            userButton.setAttribute('aria-expanded', 'false');
        }
        
        // Remover el event listener
        document.removeEventListener('click', closeUserMenuOnClickOutside);
    }
}

// ---------- Funciones de Notificaciones ----------
function abrirNotificaciones() {
    // Cerrar menú de usuario primero
    if (userMenuOpen) {
        toggleUserMenu();
    }
    
    // Abrir modal de notificaciones después de un pequeño delay
    setTimeout(() => {
        document.getElementById("modalNotificaciones").classList.remove("hidden");
        cargarPreferenciasGuardadas();
    }, 150);
}

function cerrarNotificaciones() {
    document.getElementById("modalNotificaciones").classList.add("hidden");
}

function cargarPreferenciasGuardadas() {
    const preferencias = JSON.parse(localStorage.getItem("notificaciones")) || {
        puntos: true,
        promociones: true,
        productos: true,
        habitos: true
    };
    
    const form = document.getElementById("formNotificaciones");
    if (form) {
        form.puntos.checked = preferencias.puntos;
        form.promociones.checked = preferencias.promociones;
        form.productos.checked = preferencias.productos;
        form.habitos.checked = preferencias.habitos;
    }
}

function guardarPreferencias(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const preferencias = {
        puntos: formData.get('puntos') === 'on',
        promociones: formData.get('promociones') === 'on',
        productos: formData.get('productos') === 'on',
        habitos: formData.get('habitos') === 'on'
    };
    
    localStorage.setItem("notificaciones", JSON.stringify(preferencias));
    generarNotificacion("✅ Preferencias de notificaciones guardadas");
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
    if (!lista) return;
    
    lista.innerHTML = '';

    cupones.forEach(cupon => {
        const puedeCanjear = puntosUsuario >= cupon.puntos && cupon.activo;
        lista.innerHTML += `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                    <div class="font-semibold">${cupon.nombre}</div>
                    <div class="text-xs text-gray-500">Requiere ${formatearNumero(cupon.puntos)} puntos • ${cupon.app}</div>
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
        generarNotificacion("❌ Este cupón ya no está disponible.", "error");
        return;
    }
    if (puntosUsuario < cupon.puntos) {
        generarNotificacion("❌ No tienes puntos suficientes para canjear este cupón.", "error");
        return;
    }

    puntosUsuario -= cupon.puntos;
    localStorage.setItem('puntosUsuario', puntosUsuario);
    generarNotificacion(`✅ Cupón canjeado: ${cupon.nombre} (${cupon.app})`);
    cargarCupones();
    actualizarPuntosUI();
    cerrarCupones();
}

// ---------- Funciones de Canje de Puntos ----------
function abrirModalCanjear() {
    document.getElementById("modalCanjear").classList.remove("hidden");
    document.getElementById("puntosModal").textContent = formatearNumero(puntosUsuario);
}

function cerrarModalCanjear() {
    document.getElementById("modalCanjear").classList.add("hidden");
}

function canjearProducto(puntosRequeridos, nombreProducto) {
    if (puntosUsuario < puntosRequeridos) {
        generarNotificacion("❌ No tienes puntos suficientes para canjear este producto.", "error");
        return;
    }

    puntosUsuario -= puntosRequeridos;
    localStorage.setItem('puntosUsuario', puntosUsuario);
    generarNotificacion(`✅ Canjeado: ${nombreProducto} por ${formatearNumero(puntosRequeridos)} puntos`);
    actualizarPuntosUI();
    document.getElementById("puntosModal").textContent = formatearNumero(puntosUsuario);
}

// ---------- Funciones del Lector QR ----------
function abrirLectorQR() {
    document.getElementById("modalLectorQR").classList.remove("hidden");
    document.getElementById("resultadoQR").classList.add("hidden");
    document.getElementById("btnIniciarCamara").classList.remove("hidden");
    document.getElementById("btnDetenerCamara").classList.add("hidden");
}

function cerrarLectorQR() {
    detenerCamara();
    document.getElementById("modalLectorQR").classList.add("hidden");
}

function iniciarCamara() {
    const video = document.getElementById('video');
    const btnIniciar = document.getElementById('btnIniciarCamara');
    const btnDetener = document.getElementById('btnDetenerCamara');
    const camaraContainer = document.getElementById('camaraContainer');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(mediaStream) {
                stream = mediaStream;
                video.srcObject = stream;
                video.play();
                video.classList.remove('hidden');
                camaraContainer.querySelector('.bg-gray-100').classList.add('hidden');
                
                btnIniciar.classList.add('hidden');
                btnDetener.classList.remove('hidden');
                
                // Simular escaneo después de 2 segundos
                setTimeout(simularEscaneoQR, 2000);
            })
            .catch(function(error) {
                console.error("Error al acceder a la cámara:", error);
                generarNotificacion("❌ No se pudo acceder a la cámara", "error");
            });
    } else {
        generarNotificacion("❌ Tu dispositivo no soporta acceso a la cámara", "error");
    }
}

function detenerCamara() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    const video = document.getElementById('video');
    video.classList.add('hidden');
    document.getElementById('btnIniciarCamara').classList.remove('hidden');
    document.getElementById('btnDetenerCamara').classList.add('hidden');
    
    const camaraContainer = document.getElementById('camaraContainer');
    camaraContainer.querySelector('.bg-gray-100').classList.remove('hidden');
}

function simularEscaneoQR() {
    const productosSimulados = [
        "Botella de Agua Reutilizable - 15 Puntos Verdes",
        "Panel Solar Portátil - 50 Puntos Verdes",
        "Compuesto Orgánico - 25 Puntos Verdes"
    ];
    
    const productoAleatorio = productosSimulados[Math.floor(Math.random() * productosSimulados.length)];
    
    document.getElementById("qrData").textContent = productoAleatorio;
    document.getElementById("resultadoQR").classList.remove("hidden");
    
    // Sumar puntos simulados
    const puntosGanados = parseInt(productoAleatorio.match(/(\d+)/)[0]);
    puntosUsuario += puntosGanados;
    localStorage.setItem('puntosUsuario', puntosUsuario);
    actualizarPuntosUI();
    
    generarNotificacion(`✅ ${productoAleatorio}`, "success");
    detenerCamara();
}

// ---------- Calculadora de Huella de Carbono ----------
function abrirCalculadoraHuella() {
    document.getElementById("modalCalculadoraHuella").classList.remove("hidden");
    document.getElementById("resultadoHuella").classList.add("hidden");
    
    // Limpiar campos
    document.getElementById('transporteKm').value = '';
    document.getElementById('consumoElectrico').value = '';
}

function cerrarCalculadoraHuella() {
    document.getElementById("modalCalculadoraHuella").classList.add("hidden");
}

function calcularHuella() {
    const transporte = parseInt(document.getElementById('transporteKm').value) || 0;
    const electricidad = parseInt(document.getElementById('consumoElectrico').value) || 0;
    const alimentacion = document.getElementById('tipoAlimentacion').value;
    
    // Cálculos simulados
    let huellaTransporte = transporte * 0.2; // 0,2 kg CO₂ por km
    let huellaElectricidad = electricidad * 0.5; // 0,5 kg CO₂ por kWh
    let huellaAlimentacion = 0;
    
    switch(alimentacion) {
        case 'vegetariano': huellaAlimentacion = 100; break;
        case 'vegano': huellaAlimentacion = 80; break;
        default: huellaAlimentacion = 150; // omnivoro
    }
    
    const huellaTotal = huellaTransporte + huellaElectricidad + huellaAlimentacion;
    const promedioNacional = 300; // kg CO₂/mes promedio
    
    // Mostrar resultados con formato chileno
    document.getElementById('huellaResultado').textContent = `${formatearDecimal(huellaTotal, 1)} kg CO₂/mes`;
    
    const diferencia = Math.abs(huellaTotal - promedioNacional);
    if (huellaTotal < promedioNacional) {
        document.getElementById('comparativaHuella').textContent = 
            `¡Excelente! Estás ${formatearDecimal(diferencia, 1)} kg por debajo del promedio nacional`;
    } else {
        document.getElementById('comparativaHuella').textContent = 
            `Estás ${formatearDecimal(diferencia, 1)} kg por encima del promedio nacional`;
    }
    
    const porcentaje = Math.min((huellaTotal / 500) * 100, 100);
    document.getElementById('barraProgreso').style.width = `${porcentaje}%`;
    document.getElementById('resultadoHuella').classList.remove('hidden');
    
    generarNotificacion("🌍 Huella de carbono calculada");
}

// ---------- Funciones de Historial ----------
function abrirHistorialEscaneos() {
    document.getElementById("modalHistorialEscaneos").classList.remove("hidden");
}

function cerrarHistorialEscaneos() {
    document.getElementById("modalHistorialEscaneos").classList.add("hidden");
}

function exportarHistorial() {
    generarNotificacion("📄 Historial exportado exitosamente");
}

// ---------- Funciones de Estadísticas ----------
function abrirEstadisticas() {
    document.getElementById("modalEstadisticas").classList.remove("hidden");
}

function cerrarEstadisticas() {
    document.getElementById("modalEstadisticas").classList.add("hidden");
}

function compartirEstadisticas() {
    generarNotificacion("📊 Estadísticas compartidas");
}

// ---------- Funciones de Pedidos ----------
function mostrarDetallesPedido() {
    document.getElementById("modalDetallesPedido").classList.remove("hidden");
}

function cerrarDetallesPedido() {
    document.getElementById("modalDetallesPedido").classList.add("hidden");
}

function seguirPedido() {
    generarNotificacion("🚚 Redirigiendo a seguimiento de pedido");
}

// ---------- Funciones de Ayuda ----------
function abrirAyuda() {
    document.getElementById("modalAyuda").classList.remove("hidden");
}

function cerrarAyuda() {
    document.getElementById("modalAyuda").classList.add("hidden");
}

function contactarSoporte() {
    generarNotificacion("📧 Redirigiendo a formulario de contacto");
}

// ---------- Funciones del Mapa ----------
function abrirMapaEcoPuntos() {
    document.getElementById("modalMapaEcoPuntos").classList.remove("hidden");
}

function cerrarMapaEcoPuntos() {
    document.getElementById("modalMapaEcoPuntos").classList.add("hidden");
}

function actualizarUbicacion() {
    generarNotificacion("📍 Ubicación actualizada");
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
    const vacio = document.getElementById('favoritosVacio');
    
    if (!lista) return;
    
    if (productosFavoritos.length === 0) {
        lista.classList.add('hidden');
        vacio.classList.remove('hidden');
        return;
    }
    
    lista.classList.remove('hidden');
    vacio.classList.add('hidden');
    
    lista.innerHTML = productosFavoritos.map(producto => `
        <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border">
            <div class="flex items-center space-x-3">
                <i class="fas fa-heart text-red-500"></i>
                <div>
                    <div class="font-semibold text-gray-800">${producto.nombre || 'Producto'}</div>
                    <div class="text-xs text-gray-500">${formatearMoneda(producto.precio || 0)} - ${formatearNumero(producto.puntosVerdes || 0)} Puntos</div>
                </div>
            </div>
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">
                Comprar
            </button>
        </div>
    `).join('');
}

function limpiarFavoritos() {
    if (confirm("¿Estás seguro de que quieres limpiar todos tus favoritos?")) {
        productosFavoritos = [];
        localStorage.setItem('productosFavoritos', JSON.stringify(productosFavoritos));
        generarNotificacion("🗑️ Favoritos limpiados");
        cargarFavoritos();
    }
}

function irATienda() {
    window.location.href = '../tienda/tienda.html';
}

// ---------- Funciones de Sincronización ----------
function sincronizarDatos() {
    generarNotificacion("🔄 Sincronizando datos...");
    setTimeout(() => {
        generarNotificacion("✅ Datos sincronizados correctamente");
    }, 2000);
}

// ---------- Funciones de Escáner ----------
function abrirEscanerBarras() {
    generarNotificacion("📷 Abriendo escáner de códigos de barras");
    // En una implementación real, aquí se abriría el escáner
}

// ---------- Funciones de Reportes ----------
function exportarReporte() {
    generarNotificacion("📊 Generando reporte de impacto ambiental...");
    setTimeout(() => {
        generarNotificacion("✅ Reporte exportado exitosamente");
    }, 1500);
}

function compartirReporte() {
    generarNotificacion("📤 Compartiendo reporte de impacto...");
}

// ---------- Actualización de Métricas Ambientales ----------
function actualizarMetricasAmbientales() {
    // Actualizar CO₂ evitado
    const co2Element = document.getElementById('carbonoEvitado');
    if (co2Element) {
        co2Element.textContent = formatearDecimal(5.8);
    }
    
    // Actualizar árboles equivalentes
    const arbolesElement = document.getElementById('arbolesEquiv');
    if (arbolesElement) {
        arbolesElement.textContent = formatearDecimal(0.3, 1);
    }
    
    // Actualizar métricas en el modal de estadísticas
    const metricasEstadisticas = [
        { id: 'co2Evitado', valor: 5.8 },
        { id: 'arbolesEquiv', valor: 0.26 },
        { id: 'productosEscaneados', valor: 12 },
        { id: 'rankingEcologico', valor: 47 }
    ];
    
    metricasEstadisticas.forEach(metrica => {
        const elemento = document.getElementById(metrica.id);
        if (elemento) {
            if (metrica.id === 'rankingEcologico') {
                elemento.textContent = `${formatearNumero(metrica.valor)}°`;
            } else if (metrica.id === 'productosEscaneados') {
                elemento.textContent = formatearNumero(metrica.valor);
            } else {
                elemento.textContent = formatearDecimal(metrica.valor, metrica.id === 'arbolesEquiv' ? 2 : 1);
            }
        }
    });
}

// ---------- Utilidades ----------
function actualizarPuntosUI() {
    const elementosPuntos = [
        'puntosDisplay',
        'puntosModal',
        'totalPuntos'
    ];
    
    elementosPuntos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = formatearNumero(puntosUsuario);
        }
    });
}

function generarNotificacion(mensaje, tipo = "success") {
    // Crear elemento de notificación
    const noti = document.createElement("div");
    
    // Configurar estilos según el tipo
    const bgColor = tipo === "success" ? "bg-green-600" : 
                   tipo === "error" ? "bg-red-600" : 
                   tipo === "warning" ? "bg-yellow-600" : "bg-blue-600";
    
    noti.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-[10000] transform transition-all duration-300`;
    noti.innerText = mensaje;
    noti.style.transform = 'translateX(100%)';
    noti.style.opacity = '0';
    
    // Agregar al DOM
    document.body.appendChild(noti);
    
    // Animación de entrada
    setTimeout(() => {
        noti.style.transform = 'translateX(0)';
        noti.style.opacity = '1';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        noti.style.transform = 'translateX(100%)';
        noti.style.opacity = '0';
        setTimeout(() => {
            if (noti.parentNode) {
                noti.parentNode.removeChild(noti);
            }
        }, 300);
    }, 4000);
}

function cerrarModalPorId(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    }
}

function cerrarTodosLosModales() {
    const modales = document.querySelectorAll('[id^="modal"]');
    modales.forEach(modal => {
        modal.classList.add("hidden");
    });
    
    // Cerrar menú de usuario también
    if (userMenuOpen) {
        toggleUserMenu();
    }
}

// ---------- Exportar funciones globalmente ----------
window.toggleUserMenu = toggleUserMenu;
window.abrirNotificaciones = abrirNotificaciones;
window.cerrarNotificaciones = cerrarNotificaciones;
window.guardarPreferencias = guardarPreferencias;
window.abrirCupones = abrirCupones;
window.cerrarCupones = cerrarCupones;
window.canjearCupon = canjearCupon;
window.abrirModalCanjear = abrirModalCanjear;
window.cerrarModalCanjear = cerrarModalCanjear;
window.canjearProducto = canjearProducto;
window.abrirLectorQR = abrirLectorQR;
window.cerrarLectorQR = cerrarLectorQR;
window.iniciarCamara = iniciarCamara;
window.detenerCamara = detenerCamara;
window.abrirCalculadoraHuella = abrirCalculadoraHuella;
window.cerrarCalculadoraHuella = cerrarCalculadoraHuella;
window.calcularHuella = calcularHuella;
window.abrirHistorialEscaneos = abrirHistorialEscaneos;
window.cerrarHistorialEscaneos = cerrarHistorialEscaneos;
window.exportarHistorial = exportarHistorial;
window.abrirEstadisticas = abrirEstadisticas;
window.cerrarEstadisticas = cerrarEstadisticas;
window.compartirEstadisticas = compartirEstadisticas;
window.mostrarDetallesPedido = mostrarDetallesPedido;
window.cerrarDetallesPedido = cerrarDetallesPedido;
window.seguirPedido = seguirPedido;
window.abrirAyuda = abrirAyuda;
window.cerrarAyuda = cerrarAyuda;
window.contactarSoporte = contactarSoporte;
window.abrirMapaEcoPuntos = abrirMapaEcoPuntos;
window.cerrarMapaEcoPuntos = cerrarMapaEcoPuntos;
window.actualizarUbicacion = actualizarUbicacion;
window.abrirFavoritos = abrirFavoritos;
window.cerrarFavoritos = cerrarFavoritos;
window.limpiarFavoritos = limpiarFavoritos;
window.irATienda = irATienda;
window.sincronizarDatos = sincronizarDatos;
window.abrirEscanerBarras = abrirEscanerBarras;
window.exportarReporte = exportarReporte;
window.compartirReporte = compartirReporte;
window.generarNotificacion = generarNotificacion;
window.formatearNumero = formatearNumero;
window.formatearDecimal = formatearDecimal;
window.formatearMoneda = formatearMoneda;
