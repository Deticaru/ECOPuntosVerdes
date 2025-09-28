// src/tienda/tienda.js
import { productos, tarjetasFicticias } from '../data/productos.js';

let productoSeleccionado = null;
let tarjetaSeleccionada = null;
let puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 123;

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarPuntosUI();
});

function cargarProductos() {
    const grid = document.getElementById('productosGrid');
    
    grid.innerHTML = productos.map(producto => `
        <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div class="flex space-x-4">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-20 h-20 object-cover rounded-xl">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 mb-1">${producto.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-2">${producto.descripcion}</p>
                    
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-lg font-bold text-green-600">$${producto.precio.toLocaleString()}</span>
                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            +${producto.puntosVerdes} pts
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-blue-600">
                            <i class="fas fa-leaf"></i> -${Math.abs(producto.huellaCarbonoKg)} kg CO₂
                        </span>
                        <span class="text-xs text-gray-500">${producto.categoria}</span>
                    </div>
                    
                    <button onclick="comprarProducto(${producto.id})" 
                            class="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ... resto de funciones igual que antes ...

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
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <img src="${productoSeleccionado.imagen}" alt="${productoSeleccionado.nombre}" 
                 class="w-12 h-12 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${productoSeleccionado.nombre}</h4>
                <p class="text-gray-600">$${productoSeleccionado.precio.toLocaleString()}</p>
                <p class="text-green-600 text-sm">+${productoSeleccionado.puntosVerdes} puntos</p>
            </div>
        </div>
    `;
    
    tarjetas.innerHTML = tarjetasFicticias.map(tarjeta => `
        <div onclick="seleccionarTarjeta(${tarjeta.id})" 
             class="tarjeta-opcion border border-gray-200 rounded-xl p-3 cursor-pointer mb-3">
            <div class="flex justify-between">
                <span class="font-medium">${tarjeta.tipo} ${tarjeta.numero}</span>
                <span class="text-sm text-gray-500">${tarjeta.vencimiento}</span>
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
    btnPagar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
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
        <h4 class="font-bold mb-2">${productoSeleccionado.nombre}</h4>
        <p class="text-green-600 font-bold">+${productoSeleccionado.puntosVerdes} Puntos Verdes!</p>
    `;
    
    impacto.innerHTML = `
        <div class="text-sm">
            <div class="font-semibold">CO₂ Evitado: ${Math.abs(productoSeleccionado.huellaCarbonoKg)} kg</div>
            <div class="text-gray-600">${calcularEquivalencia(productoSeleccionado.huellaCarbonoKg)}</div>
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