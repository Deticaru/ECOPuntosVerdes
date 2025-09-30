// src/menu/menu.js

let puntosUsuario = 0;
let historialCompras = [];

// Inicializar página responsiva
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    actualizarEstadisticasHome();
    animarElementos();
    configurarResponsive();
});

function cargarDatosUsuario() {
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
        localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
    }
}

function actualizarEstadisticasHome() {
    const carbonoTotal = historialCompras.reduce((sum, compra) => sum + Math.abs(compra.carbono), 0);
    const arbolesEquiv = (carbonoTotal / 22);

    // Actualizar elementos si existen
    const elementos = {
        'puntosDisplay': puntosUsuario,
        'carbonoEvitado': carbonoTotal.toFixed(1),
        'arbolesEquiv': arbolesEquiv.toFixed(1)
    };

    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            animarNumero(elemento, valor);
        }
    });
}

function animarNumero(elemento, valorFinal, duracion = 1500) {
    const valorInicial = 0;
    const incremento = valorFinal / (duracion / 50);
    let valorActual = valorInicial;
    
    const animacion = setInterval(() => {
        valorActual += incremento;
        
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(animacion);
        }
        
        elemento.textContent = typeof valorFinal === 'string' ? 
            valorActual.toFixed(1) : 
            Math.floor(valorActual);
    }, 50);
}

function animarElementos() {
    // Animación escalonada para las cards
    const cards = document.querySelectorAll('.animate-fade-in');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function configurarResponsive() {
    // Detectar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        actualizarLayoutResponsive();
    });
    
    actualizarLayoutResponsive();
}

function actualizarLayoutResponsive() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    // Ajustar navegación según el tamaño
    if (isDesktop) {
        document.body.classList.add('desktop-mode');
        document.body.classList.remove('mobile-mode', 'tablet-mode');
    } else if (isTablet) {
        document.body.classList.add('tablet-mode');
        document.body.classList.remove('mobile-mode', 'desktop-mode');
    } else {
        document.body.classList.add('mobile-mode');
        document.body.classList.remove('tablet-mode', 'desktop-mode');
    }
}

// Funciones de navegación
function irATienda() {
    window.location.href = '../tienda/tienda.html';
}

function irADashboard() {
    window.location.href = '../dashboard/dashboard.html';
}

function mostrarDetallesPedido() {
    alert('Funcionalidad de detalles de pedido - En desarrollo');
}

function escanearProducto() {
    alert('Funcionalidad de escáner - En desarrollo');
}

// Actualizar cuando la ventana recibe foco
window.addEventListener('focus', () => {
    cargarDatosUsuario();
    actualizarEstadisticasHome();
});

// Lazy loading para imágenes (si las hay)
function configurarLazyLoading() {
    const imagenes = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    imagenes.forEach(img => imageObserver.observe(img));
}

function exportarReporte() {
    alert("El reporte de impacto ambiental se exportará en formato PDF o Excel.");
    // Aquí se puede integrar una librería como jsPDF o SheetJS para generar el archivo
}

function compartirReporte() {
    if (navigator.share) {
        navigator.share({
            title: "Mi Impacto Ambiental",
            text: "He ahorrado CO₂ y contribuido al medioambiente 🌱",
            url: window.location.href
        })
        .then(() => console.log("Compartido con éxito"))
        .catch((error) => console.log("Error al compartir:", error));
    } else {
        alert("La opción de compartir no está disponible en este navegador.");
    }
}

// Inicializar lazy loading si hay imágenes
configurarLazyLoading();

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

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

// Guardar preferencias
document.getElementById("formNotificaciones").addEventListener("submit", function(e) {
  e.preventDefault();

  const preferencias = {
    puntos: this.puntos.checked,
    promociones: this.promociones.checked,
    productos: this.productos.checked,
    habitos: this.habitos.checked
  };

  // Guardar en localStorage (simulación de BD/Backend)
  localStorage.setItem("notificaciones", JSON.stringify(preferencias));

  alert("✅ Preferencias de notificaciones guardadas con éxito");
  cerrarNotificaciones();
});

// Simulación de envío de notificaciones
function generarNotificacion(mensaje) {
  const noti = document.createElement("div");
  noti.className = "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce";
  noti.innerText = mensaje;
  document.body.appendChild(noti);
  setTimeout(() => noti.remove(), 4000);
}

// Ejemplo: lanzar notificación automática
setTimeout(() => {
  const prefs = JSON.parse(localStorage.getItem("notificaciones")) || {};
  if (prefs.puntos) {
    generarNotificacion("🎉 Has sumado 50 Puntos Verdes en tu última compra");
  }
}, 5000);


// Funciones modal Cupones
function abrirCupones() {
    document.getElementById("modalCupones").classList.remove("hidden");
    cargarCupones();
}

function cerrarCupones() {
    document.getElementById("modalCupones").classList.add("hidden");
}

// Datos simulados de cupones
let cupones = [
    { id: 1, nombre: '10% Descuento Walmart', puntos: 50, activo: true, app: 'Walmart' },
    { id: 2, nombre: '5% Descuento EcoPuntos', puntos: 20, activo: true, app: 'EcoPuntos' },
    { id: 3, nombre: '15% Descuento Walmart', puntos: 100, activo: false, app: 'Walmart' }
];

// Cargar cupones dinámicamente
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
document.getElementById('btnCupones').addEventListener('click', abrirCupones);
