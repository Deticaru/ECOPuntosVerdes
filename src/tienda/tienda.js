import { productos, tarjetasFicticias } from '../data/productos.js';

let productoSeleccionado = null;
let tarjetaSeleccionada = null;
let puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 180;
let productosFavoritos = JSON.parse(localStorage.getItem('productosFavoritos')) || [];

// Datos simulados de cupones (idénticos a menu.js)
let cupones = [
    { id: 1, nombre: '10% Descuento Walmart', puntos: 50, activo: true, app: 'Walmart' },
    { id: 2, nombre: '5% Descuento EcoPuntos', puntos: 20, activo: true, app: 'EcoPuntos' },
    { id: 3, nombre: '15% Descuento Walmart', puntos: 100, activo: false, app: 'Walmart' }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarPuntosUI();

    // Botón y link de canjear cupones
    const btnCanjear = document.getElementById('btnCanjearPuntos');
    if (btnCanjear) btnCanjear.addEventListener('click', abrirCupones);

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

    // Configurar cierre de modales
    configurarCierreModales();
});

function cargarProductos() {
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = productos.map(producto => {
        const esFavorito = productosFavoritos.some(fav => fav.id === producto.id);
        return `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex space-x-4">
                <div class="flex-shrink-0 relative">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-20 h-20 object-cover rounded-xl border border-gray-200">
                    <button onclick="toggleFavorito(${producto.id})" 
                            class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110 ${esFavorito ? 'text-red-500' : 'text-gray-400'}">
                        <i class="fas fa-heart ${esFavorito ? 'fas' : 'far'}"></i>
                    </button>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 text-lg mb-1 truncate">${producto.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${producto.descripcion}</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-green-600 text-xl font-bold">$${producto.precio.toLocaleString()}</span>
                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">+${producto.puntosVerdes} pts</span>
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center text-blue-600 text-sm">
                            <i class="fas fa-leaf mr-1"></i>
                            <span>-${Math.abs(producto.huellaCarbonoKg)} kg CO₂</span>
                        </div>
                        <span class="text-gray-500 text-sm">${producto.categoria}</span>
                    </div>
                    <button onclick="comprarProducto(${producto.id})" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-colors shadow-sm">
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

function calcularEquivalencia(huellaKg) {
    const arboles = Math.abs(huellaKg / 22);
    return `${arboles.toFixed(1)} árboles plantados`;
}

// Función para agregar/remover de favoritos
window.toggleFavorito = function(productId) {
    const producto = productos.find(p => p.id === productId);
    const index = productosFavoritos.findIndex(fav => fav.id === productId);
    
    if (index === -1) {
        // Agregar a favoritos
        productosFavoritos.push(producto);
        generarNotificacion(`❤️ "${producto.nombre}" agregado a favoritos`);
    } else {
        // Remover de favoritos
        productosFavoritos.splice(index, 1);
        generarNotificacion(`💔 "${producto.nombre}" removido de favoritos`);
    }
    
    // Guardar en localStorage
    localStorage.setItem('productosFavoritos', JSON.stringify(productosFavoritos));
    
    // Actualizar interfaz
    cargarProductos();
    
    // Si el modal de favoritos está abierto, actualizarlo
    if (!document.getElementById('modalFavoritos').classList.contains('hidden')) {
        cargarFavoritos();
    }
}

// Función para abrir modal de favoritos
function abrirFavoritos() {
    document.getElementById("modalFavoritos").classList.remove("hidden");
    cargarFavoritos();
}

function cerrarFavoritos() {
    document.getElementById("modalFavoritos").classList.add("hidden");
}

// Cargar productos favoritos en el modal
function cargarFavoritos() {
    const lista = document.getElementById('listaFavoritos');
    
    if (productosFavoritos.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-heart text-gray-300 text-4xl mb-3"></i>
                <p class="text-gray-500">No tienes productos favoritos</p>
                <p class="text-sm text-gray-400 mt-1">Haz clic en el corazón de los productos para agregarlos</p>
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
                <button onclick="comprarProducto(${producto.id})" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    Comprar
                </button>
                <button onclick="toggleFavorito(${producto.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.comprarProducto = function(productId) {
    productoSeleccionado = productos.find(p => p.id === productId);
    mostrarModalPago();
    // Cerrar modal de favoritos si está abierto
    cerrarFavoritos();
}

function mostrarModalPago() {
    const modal = document.getElementById('modalPago');
    const detalle = document.getElementById('detalleProducto');
    const tarjetas = document.getElementById('tarjetasDisponibles');

    detalle.innerHTML = `
        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border">
            <img src="${productoSeleccionado.imagen}" alt="${productoSeleccionado.nombre}" class="w-16 h-16 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${productoSeleccionado.nombre}</h4>
                <p class="text-gray-600 text-lg">$${productoSeleccionado.precio.toLocaleString()}</p>
                <p class="text-green-600 text-sm font-semibold"><i class="fas fa-leaf mr-1"></i> +${productoSeleccionado.puntosVerdes} puntos verdes</p>
            </div>
        </div>
    `;

    tarjetas.innerHTML = tarjetasFicticias.map(tarjeta => `
        <div onclick="seleccionarTarjeta(${tarjeta.id})" class="tarjeta-opcion border-2 border-gray-200 rounded-2xl p-4 cursor-pointer mb-3 hover:border-blue-300 transition-colors">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold text-gray-800">${tarjeta.tipo}</span>
                    <span class="text-gray-600 ml-2">${tarjeta.numero}</span>
                </div>
                <div class="text-sm text-gray-500">${tarjeta.vencimiento}</div>
            </div>
        </div>
    `).join('');

    modal.classList.remove('hidden');
}

window.seleccionarTarjeta = function(tarjetaId) {
    tarjetaSeleccionada = tarjetasFicticias.find(t => t.id === tarjetaId);
    document.querySelectorAll('.tarjeta-opcion').forEach(el => el.classList.remove('border-blue-500', 'bg-blue-50'));
    event.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    document.getElementById('btnPagar').disabled = false;
}

window.procesarPago = function() {
    const btnPagar = document.getElementById('btnPagar');
    btnPagar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
    btnPagar.disabled = true;

    setTimeout(() => {
        puntosUsuario += productoSeleccionado.puntosVerdes;
        localStorage.setItem('puntosUsuario', puntosUsuario);
        guardarCompra();
        mostrarConfirmacion();
        cerrarModal();
    }, 2000);
}

function guardarCompra() {
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
    historial.push({
        id: Date.now(),
        fecha: new Date().toISOString().split('T')[0],
        producto: productoSeleccionado.nombre,
        precio: productoSeleccionado.precio,
        puntos: productoSeleccionado.puntosVerdes,
        carbono: productoSeleccionado.huellaCarbonoKg,
        categoria: productoSeleccionado.categoria
    });
    localStorage.setItem('historialCompras', JSON.stringify(historial));
}

function mostrarConfirmacion() {
    const modal = document.getElementById('modalConfirmacion');
    const resumen = document.getElementById('resumenCompra');
    const impacto = document.getElementById('impactoAmbiental');

    resumen.innerHTML = `
        <h4 class="font-bold mb-2 text-lg">${productoSeleccionado.nombre}</h4>
        <p class="text-gray-600 mb-2">Precio: $${productoSeleccionado.precio.toLocaleString()}</p>
        <p class="text-green-600 font-bold text-lg">+${productoSeleccionado.puntosVerdes} Puntos Verdes! 🎉</p>
    `;

    impacto.innerHTML = `
        <div class="text-center">
            <div class="font-semibold text-blue-800 mb-1">🌍 Impacto Ambiental</div>
            <div class="text-lg font-bold text-green-600">-${Math.abs(productoSeleccionado.huellaCarbonoKg)} kg CO₂</div>
            <div class="text-sm text-gray-600">${calcularEquivalencia(productoSeleccionado.huellaCarbonoKg)}</div>
        </div>
    `;

    actualizarPuntosUI();
    modal.classList.remove('hidden');
}

function actualizarPuntosUI() {
    const puntosElement = document.getElementById('puntosUsuario');
    if (puntosElement) {
        puntosElement.textContent = `${puntosUsuario} Puntos Verdes`;
    }
}

// Función para regresar al menú
function irAlMenu() {
    window.location.href = '../menu/menu.html';
}

window.cerrarModal = function() {
    document.getElementById('modalPago').classList.add('hidden');
    productoSeleccionado = null;
    tarjetaSeleccionada = null;
    document.getElementById('btnPagar').innerHTML = 'Pagar Ahora';
    document.getElementById('btnPagar').disabled = true;
}

window.cerrarConfirmacion = function() {
    document.getElementById('modalConfirmacion').classList.add('hidden');
}

// ---------- Funciones de Cupones (idénticas a menu.js) ----------
function abrirCupones() {
    document.getElementById("modalCupones").classList.remove("hidden");
    cargarCupones();
}

function cerrarCupones() {
    document.getElementById("modalCupones").classList.add("hidden");
}

// Cargar cupones dinámicamente (misma función que en menu.js)
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

// Canjear cupón (misma función que en menu.js)
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
    
    // Mostrar notificación de éxito
    generarNotificacion(`✅ Cupón canjeado: ${cupon.nombre} (${cupon.app})`);
    
    // Actualizar interfaz
    cargarCupones();
    actualizarPuntosUI();
    cerrarCupones();
}

// Función de notificación
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

// Configurar cierre de modales al hacer clic fuera
function configurarCierreModales() {
    // Cerrar modales al hacer clic fuera
    ['modalCupones', 'modalFavoritos', 'modalPago', 'modalConfirmacion'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modalId === 'modalCupones') cerrarCupones();
                    if (modalId === 'modalFavoritos') cerrarFavoritos();
                    if (modalId === 'modalPago') window.cerrarModal();
                    if (modalId === 'modalConfirmacion') window.cerrarConfirmacion();
                }
            });
        }
    });
}

// Exponer funciones usadas por atributos onclick cuando se usa type="module"
window.abrirCupones = abrirCupones;
window.cerrarCupones = cerrarCupones;
window.canjearCupon = canjearCupon;
window.abrirFavoritos = abrirFavoritos;
window.cerrarFavoritos = cerrarFavoritos;
window.toggleFavorito = toggleFavorito;
window.irAlMenu = irAlMenu;
window.comprarProducto = comprarProducto;
window.seleccionarTarjeta = seleccionarTarjeta;
window.procesarPago = procesarPago;
window.cerrarModal = cerrarModal;
window.cerrarConfirmacion = cerrarConfirmacion;
