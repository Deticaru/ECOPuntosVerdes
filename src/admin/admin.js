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

    // Gráfico de Distribución de Puntos ECO
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

// Funciones del modal para agregar productos
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddProductModal();
        }
    });
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // Limpiar el formulario
    document.getElementById('addProductForm').reset();
}

function addProduct(event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(event.target);
    const productCode = formData.get('productCode');
    
    // Simular obtener el nombre desde la API de Walmart
    const simulatedProductNames = {
        'ECO001': 'Botella de Agua Reutilizable',
        'ECO002': 'Bombillas LED Ecológicas',
        'ECO003': 'Bolsas de Tela Orgánica',
        'ECO004': 'Productos de Limpieza Biodegradables'
    };
    
    const productName = simulatedProductNames[productCode] || `Producto ${productCode}`;
    
    const productData = {
        code: productCode,
        name: productName, // Obtenido desde "API"
        co2Saving: parseFloat(formData.get('co2Saving')),
        ecoPoints: parseInt(formData.get('ecoPoints'))
    };
    
    // Simular guardado del producto
    console.log('Nuevo producto agregado:', productData);
    
    // Aquí se haría la llamada real a la API para:
    // 1. Obtener el nombre del producto desde Walmart API
    // 2. Guardar la configuración ECO en la base de datos
    
    // Mostrar notificación de éxito
    showNotification(`Producto "${productData.name}" (${productData.code}) agregado exitosamente`);
    
    // Agregar fila a la tabla (opcional - para demostración visual)
    addProductToTable(productData);
    
    // Cerrar modal
    closeAddProductModal();
}

function addProductToTable(productData) {
    // Encontrar el tbody de la tabla de productos
    const tableBody = document.querySelector('#productos-section tbody');
    
    if (tableBody) {
        // Crear nueva fila
        const newRow = document.createElement('tr');
        newRow.className = 'hover:bg-gray-50';
        newRow.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${productData.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Auto-detectado</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">⏳ Pendiente sync</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${productData.co2Saving} kg CO₂</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="number" value="${productData.ecoPoints}" class="w-16 px-2 py-1 text-sm border rounded text-center">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
            </td>
        `;
        
        // Agregar al inicio de la tabla
        tableBody.insertBefore(newRow, tableBody.firstChild);
    }
}

// Función para generar reportes
function generateReport(reportType) {
    // Mapeo de tipos de reporte a nombres más descriptivos
    const reportNames = {
        'ventas': 'Reporte de Ventas ECO',
        'usuarios': 'Reporte de Usuarios'
    };
    
    const reportName = reportNames[reportType] || 'Reporte';
    
    // Simular proceso de generación del reporte
    showNotification(`Generando ${reportName}...`);
    
    // Simular delay de generación (2 segundos)
    setTimeout(() => {
        // Generar nombre de archivo con timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const fileName = `${reportType}_${timestamp}.pdf`;
        
        // Mostrar notificación de éxito con opción de descarga
        showReportReadyNotification(reportName, fileName);
    }, 2000);
}

// Función especial para notificación de reporte listo
function showReportReadyNotification(reportName, fileName) {
    // Crear elemento de notificación con botón de descarga
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 max-w-sm';
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
                <div class="font-semibold">¡Reporte Generado!</div>
                <div class="text-sm opacity-90 mt-1">${reportName}</div>
                <button id="download-${fileName}" onclick="downloadReport('${fileName}'); this.disabled=true; this.innerHTML='⬇️ Descargando...'; this.classList.add('opacity-50', 'cursor-not-allowed')" class="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm font-medium transition-colors">
                    📥 Descargar ${fileName}
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-ocultar después de 8 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 8000);
}

// Variable para controlar descargas en progreso
let downloadInProgress = new Set();

// Función para simular descarga del reporte
function downloadReport(fileName) {
    // Prevenir múltiples descargas del mismo archivo
    if (downloadInProgress.has(fileName)) {
        return;
    }
    
    // Marcar como descarga en progreso
    downloadInProgress.add(fileName);
    
    // En un entorno real, aquí se haría la descarga del archivo
    showNotification(`Iniciando descarga de ${fileName}...`);
    
    // Simular descarga creando un enlace temporal
    const link = document.createElement('a');
    link.href = '#'; // En producción sería la URL real del archivo
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // En un entorno real, aquí se removería el enlace después de la descarga
    setTimeout(() => {
        document.body.removeChild(link);
        showNotification(`${fileName} se ha descargado exitosamente`);
        
        // Remover de la lista de descargas en progreso
        downloadInProgress.delete(fileName);
    }, 1000);
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar sección ventas por defecto
    showSection('ventas');
});