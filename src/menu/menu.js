// src/menu/menu.js

let puntosUsuario = 0;
let historialCompras = [];

// Inicializar página de inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    actualizarEstadisticasHome();
    animarPuntos();
});

function cargarDatosUsuario() {
    // Cargar datos del localStorage
    puntosUsuario = parseInt(localStorage.getItem('puntosUsuario')) || 125;
    historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
    
    // Si no hay historial, crear datos de ejemplo
    if (historialCompras.length === 0) {
        historialCompras = [
            {
                id: 1,
                fecha: '2024-09-15',
                producto: 'Botella Reutilizable (Demo)',
                precio: 15000,
                puntos: 15,
                carbono: -2.3,
                categoria: 'Sustentable'
            },
            {
                id: 2,
                fecha: '2024-09-20',
                producto: 'Panel Solar (Demo)',
                precio: 85000,
                puntos: 50,
                carbono: -15.8,
                categoria: 'Energía Renovable'
            }
        ];
    }
}

function actualizarEstadisticasHome() {
    // Calcular estadísticas
    const carbonoTotal = historialCompras.reduce((sum, compra) => sum + Math.abs(compra.carbono), 0);
    const arbolesEquiv = (carbonoTotal / 22);

    // Actualizar UI con animación
    animarNumero('puntosHome', puntosUsuario, '');
    animarNumero('contadorPuntos', puntosUsuario, '');
    animarNumero('carbonoHome', carbonoTotal, '', 1);
    animarNumero('arbolesHome', arbolesEquiv, '', 1);
}

function animarNumero(elementId, valorFinal, sufijo = '', decimales = 0) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    let valorActual = 0;
    const incremento = valorFinal / 50; // 50 pasos de animación
    const duracionPaso = 30; // milisegundos por paso
    
    const animacion = setInterval(() => {
        valorActual += incremento;
        
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(animacion);
        }
        
        elemento.textContent = valorActual.toFixed(decimales) + sufijo;
    }, duracionPaso);
}

function animarPuntos() {
    // Animación de parpadeo para los puntos
    const puntoselemento = document.getElementById('puntosUsuario');
    
    setInterval(() => {
        puntoselemento.classList.add('animate-pulse');
        setTimeout(() => {
            puntosElement.classList.remove('animate-pulse');
        }, 1000);
    }, 3000);
}

// Función para mostrar notificaciones de bienvenida
function mostrarBienvenida() {
    // Solo mostrar si es la primera visita
    if (!localStorage.getItem('visitaAnterior')) {
        setTimeout(() => {
            if (confirm('🌱 ¡Bienvenido a ECO Puntos Verdes! \n\n¿Te gustaría hacer un tour rápido por la tienda?')) {
                window.location.href = '../tienda/tienda.html';
            }
            localStorage.setItem('visitaAnterior', 'true');
        }, 2000);
    }
}

// Actualizar datos cuando la ventana recibe foco (usuario vuelve de otra página)
window.addEventListener('focus', () => {
    cargarDatosUsuario();
    actualizarEstadisticasHome();
});

// Efectos visuales adicionales
document.addEventListener('DOMContentLoaded', () => {
    // Efecto de aparición gradual para las tarjetas
    const tarjetas = document.querySelectorAll('.bg-white');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    tarjetas.forEach(tarjeta => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(20px)';
        tarjeta.style.transition = 'all 0.6s ease-out';
        observer.observe(tarjeta);
    });
    
    // Mostrar bienvenida después de un momento
    mostrarBienvenida();
});

// Funciones de utilidad para efectos visuales
function crearEfectoConfeti() {
    // Efecto de confeti cuando se alcanzan ciertos hitos
    if (puntosUsuario > 0 && puntosUsuario % 50 === 0) {
        // Crear elementos de confeti (simplificado)
        const colores = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
        
        for (let i = 0; i < 20; i++) {
            const confeti = document.createElement('div');
            confeti.style.position = 'fixed';
            confeti.style.width = '10px';
            confeti.style.height = '10px';
            confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            confeti.style.left = Math.random() * 100 + 'vw';
            confeti.style.top = '-10px';
            confeti.style.borderRadius = '50%';
            confeti.style.pointerEvents = 'none';
            confeti.style.zIndex = '9999';
            
            document.body.appendChild(confeti);
            
            // Animar caída
            confeti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 }
            ], {
                duration: 3000,
                easing: 'linear'
            }).onfinish = () => confeti.remove();
        }
    }
}