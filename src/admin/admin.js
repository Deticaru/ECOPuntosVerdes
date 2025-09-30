// admin.js - Panel de Administración ECO Puntos Verdes

// Función para sincronizar con Walmart API
function syncWithWalmart() {
    const syncButton = document.getElementById('syncButton');
    const syncText = document.getElementById('syncText');
    const syncLoader = document.getElementById('syncLoader');
    const syncSuccess = document.getElementById('syncSuccess');
    
    // Deshabilitar el botón y mostrar loading
    syncButton.disabled = true;
    syncButton.classList.add('opacity-75', 'cursor-not-allowed');
    syncText.classList.add('hidden');
    syncLoader.classList.remove('hidden');
    
    // Simular proceso de sincronización (3 segundos)
    setTimeout(() => {
        // Ocultar loading y mostrar éxito
        syncLoader.classList.add('hidden');
        syncSuccess.classList.remove('hidden');
        
        // Añadir animación de éxito
        syncButton.classList.add('animate-pulse-success', 'bg-green-600');
        syncButton.classList.remove('bg-walmart-blue');
        
        // Después de 2 segundos, volver al estado normal
        setTimeout(() => {
            syncSuccess.classList.add('hidden');
            syncText.classList.remove('hidden');
            syncButton.disabled = false;
            syncButton.classList.remove('opacity-75', 'cursor-not-allowed', 'animate-pulse-success', 'bg-green-600');
            syncButton.classList.add('bg-walmart-blue');
            
            // Mostrar notificación de actualización (opcional)
            showNotification('Sincronización completada exitosamente con Walmart API');
        }, 2000);
    }, 3000);
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Función de navegación entre secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Mostrar sección seleccionada
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Actualizar botones de navegación igual que menu.html
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        // Quitar clase active y agregar sidebar-hover
        btn.classList.remove('bg-white', 'bg-opacity-20');
        btn.classList.add('sidebar-hover', 'glass-effect');
    });

    // Resaltar botón activo exactamente como menu.html
    const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeButton) {
        activeButton.classList.remove('sidebar-hover', 'glass-effect');
        activeButton.classList.add('bg-white', 'bg-opacity-20');
    }

    // Actualizar título de la página
    const pageTitle = document.querySelector('header h1');
    const pageSubtitle = document.querySelector('header p');
    const titleMap = {
        'productos': {
            title: 'Productos ECO - Configuración',
            subtitle: 'Gestión de productos sostenibles y asignación de puntos por huella de carbono'
        },
        'usuarios': {
            title: 'Gestión de Usuarios ECO',
            subtitle: 'Administración de usuarios y seguimiento de puntos verdes'
        },
        'ventas': {
            title: 'Dashboard ECO - Impacto Ambiental',
            subtitle: 'Monitoreo de ahorro de CO₂ y otorgamiento de puntos verdes'
        },
        'reportes': {
            title: 'Centro de Reportes Ambientales',
            subtitle: 'Análisis de impacto ambiental y métricas de sostenibilidad'
        },
        'inventario': {
            title: 'Sincronización con Walmart API',
            subtitle: 'Monitor de disponibilidad de productos ecológicos en tiempo real'
        }
    };
    
    if (pageTitle && titleMap[sectionName]) {
        pageTitle.textContent = titleMap[sectionName].title;
        pageSubtitle.textContent = titleMap[sectionName].subtitle;
    }

    // Inicializar gráficos si se muestra la sección ventas
    if (sectionName === 'ventas') {
        setTimeout(() => {
            initCharts();
        }, 100);
    }
}

// Función para inicializar gráficos
function initCharts() {
    // Gráfico de Ventas
    const salesCanvas = document.getElementById('salesChart');
    if (salesCanvas && !salesCanvas.chart) {
        const salesCtx = salesCanvas.getContext('2d');
        salesCanvas.chart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'CO₂ Ahorrado (kg)',
                    data: [156, 289, 198, 341, 275, 412],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Gráfico de Inventario
    const inventoryCanvas = document.getElementById('inventoryChart');
    if (inventoryCanvas && !inventoryCanvas.chart) {
        const inventoryCtx = inventoryCanvas.getContext('2d');
        inventoryCanvas.chart = new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cero Residuos', 'Eficiencia Energética', 'Químicos Verdes', 'Transporte Verde'],
                datasets: [{
                    data: [35, 28, 22, 15],
                    backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        });
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar sección ventas por defecto
    showSection('ventas');
});