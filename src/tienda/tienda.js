// src/tienda/tienda.js
import { productos, tarjetasFicticias } from '../data/productos.js';

let productoSeleccionado = null;
let tarjetaSeleccionada = null;
let puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 180;

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarPuntosUI();
});

function cargarProductos() {
    const grid = document.getElementById('productosGrid');
    
    grid.innerHTML = productos.map(producto => `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex space-x-4">
                <!-- Imagen del producto -->
                <div class="flex-shrink-0">
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         class="w-20 h-20 object-cover rounded-xl border border-gray-200">
                </div>
                
                <!-- Información del producto -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 text-lg mb-1 truncate">${producto.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${producto.descripcion}</p>
                    
                    <!-- Precio y puntos -->
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-green-600 text-xl font-bold">$${producto.precio.toLocaleString()}</span>
                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            +${producto.puntosVerdes} pts
                        </span>
                    </div>
                    
                    <!-- Información de carbono y categoría -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center text-blue-600 text-sm">
                            <i class="fas fa-leaf mr-1"></i>
                            <span>-${Math.abs(producto.huellaCarbonoKg)} kg CO₂</span>
                        </div>
                        <span class="text-gray-500 text-sm">${producto.categoria}</span>
                    </div>
                    
                    <!-- Botón de compra -->
                    <button onclick="comprarProducto(${producto.id})" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-colors shadow-sm">
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function calcularEquivalencia(huellaKg) {
    const arboles = Math.abs(huellaKg / 22);
    return `${arboles.toFixed(1)} árboles plantados`;
}

window.comprarProducto = function(productId) {
    productoSeleccionado = productos.find(p => p.id === productId);
    mostrarModalPago();
}

function mostrarModalPago() {
    const modal = document.getElementById('modalPago');
    const detalle = document.getElementById('detalleProducto');
    const tarjetas = document.getElementById('tarjetasDisponibles');
    
    detalle.innerHTML = `
        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border">
            <img src="${productoSeleccionado.imagen}" alt="${productoSeleccionado.nombre}" 
                 class="w-16 h-16 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${productoSeleccionado.nombre}</h4>
                <p class="text-gray-600 text-lg">$${productoSeleccionado.precio.toLocaleString()}</p>
                <p class="text-green-600 text-sm font-semibold">
                    <i class="fas fa-leaf mr-1"></i> +${productoSeleccionado.puntosVerdes} puntos verdes
                </p>
            </div>
        </div>
    `;
    
    tarjetas.innerHTML = tarjetasFicticias.map(tarjeta => `
        <div onclick="seleccionarTarjeta(${tarjeta.id})" 
             class="tarjeta-opcion border-2 border-gray-200 rounded-2xl p-4 cursor-pointer mb-3 hover:border-blue-300 transition-colors">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold text-gray-800">${tarjeta.tipo}</span>
                    <span class="text-gray-600 ml-2">${tarjeta.numero}</span>
                </div>
                <div class="text-sm text-gray-500">
                    ${tarjeta.vencimiento}
                </div>
            </div>
        </div>
    `).join('');
    
    modal.classList.remove('hidden');
}

window.seleccionarTarjeta = function(tarjetaId) {
    tarjetaSeleccionada = tarjetasFicticias.find(t => t.id === tarjetaId);
    
    document.querySelectorAll('.tarjeta-opcion').forEach(el => {
        el.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
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
    document.getElementById('puntosUsuario').textContent = `${puntosUsuario} Puntos Verdes`;
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