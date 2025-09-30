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

