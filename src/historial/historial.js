// historial.js - Historial de Consumo ECO

let productosEco = [];
let graficoTendencia = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    actualizarEstadisticasCO2();
    crearGraficoTendencia();
    cargarProductosEco();
    cargarCategoriasCO2();
    cargarLogrosAmbientales();
    configurarFiltros();
});

function cargarDatosIniciales() {
    // Simular datos de productos ECO con ahorro de CO2
    productosEco = [
        {
            id: 1,
            nombre: 'Botella Reutilizable Acero',
            categoria: 'Sustentable',
            fecha: '2025-09-25',
            precio: 15000,
            puntos: 15,
            co2Ahorrado: 2.3, // kg de CO2 ahorrado vs alternativa tradicional
            descripcion: 'Botella de acero inoxidable que evita el uso de 150 botellas plásticas al año',
            imagen: '🍃'
        },
        {
            id: 2,
            nombre: 'Panel Solar Portátil',
            categoria: 'Energía Renovable',
            fecha: '2025-08-20', // Mes anterior
            precio: 85000,
            puntos: 50,
            co2Ahorrado: 15.8,
            descripcion: 'Panel solar que genera energía limpia, evitando emisiones de la red eléctrica',
            imagen: '☀️'
        },
        {
            id: 3,
            nombre: 'Bolsas Biodegradables',
            categoria: 'Eco-Packaging',
            fecha: '2025-08-15', // Mes anterior
            precio: 8500,
            puntos: 8,
            co2Ahorrado: 0.8,
            descripcion: 'Pack de 50 bolsas biodegradables que se descomponen en 6 meses',
            imagen: '🌱'
        },
        {
            id: 4,
            nombre: 'Cargador Solar USB',
            categoria: 'Energía Renovable',
            fecha: '2025-07-10', // Mes anterior
            precio: 25000,
            puntos: 25,
            co2Ahorrado: 3.2,
            descripcion: 'Cargador portátil que usa energía solar, evitando consumo eléctrico tradicional',
            imagen: '🔋'
        }
    ];

    // Guardar en localStorage para persistencia
    localStorage.setItem('productosEco', JSON.stringify(productosEco));
}

function actualizarEstadisticasCO2() {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();
    
    // Calcular CO2 del mes actual
    const co2MesActual = productosEco
        .filter(producto => {
            const fechaProducto = new Date(producto.fecha);
            return fechaProducto.getMonth() === mesActual && 
                   fechaProducto.getFullYear() === añoActual;
        })
        .reduce((total, producto) => total + producto.co2Ahorrado, 0);
    
    // Calcular CO2 total
    const co2Total = productosEco.reduce((total, producto) => total + producto.co2Ahorrado, 0);
    
    // Actualizar UI
    document.getElementById('co2MesActual').textContent = co2MesActual.toFixed(1);
    document.getElementById('co2Total').textContent = co2Total.toFixed(1);
    
    // Actualizar progreso mensual (meta: 5kg CO2/mes)
    const metaMensual = 5.0;
    const porcentaje = Math.min((co2MesActual / metaMensual) * 100, 100);
    const barraProgreso = document.getElementById('barraProgresoCO2');
    if (barraProgreso) {
        barraProgreso.style.width = `${porcentaje}%`;
    }
    
    // Actualizar texto del progreso
    const textoProgreso = document.getElementById('textoProgreso');
    if (textoProgreso) {
        let mensaje = "";
        if (porcentaje >= 100) {
            mensaje = "🎉 ¡Meta alcanzada! ¡Increíble trabajo!";
        } else if (porcentaje >= 75) {
            mensaje = `${Math.round(porcentaje)}% completado - ¡Casi logras la meta! 🌟`;
        } else if (porcentaje >= 50) {
            mensaje = `${Math.round(porcentaje)}% completado - ¡Excelente progreso! 🌱`;
        } else if (porcentaje >= 25) {
            mensaje = `${Math.round(porcentaje)}% completado - ¡Buen avance! 💚`;
        } else {
            mensaje = `${Math.round(porcentaje)}% completado - ¡Sigue así! 🌱`;
        }
        textoProgreso.textContent = mensaje;
    }
}

function crearGraficoTendencia() {
    const ctx = document.getElementById('graficoTendenciaCO2');
    if (!ctx) return;
    
    // Generar datos de los últimos 6 meses
    const meses = [];
    const datosCO2 = [];
    
    for (let i = 5; i >= 0; i--) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - i);
        meses.push(fecha.toLocaleDateString('es-ES', { month: 'short' }));
        
        // Simular datos progresivos
        const co2Mes = Math.random() * 4 + 1 + (i * 0.3); // Tendencia creciente
        datosCO2.push(co2Mes);
    }
    
    graficoTendencia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'CO₂ Ahorrado (kg)',
                data: datosCO2,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + ' kg';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function cargarProductosEco() {
    const container = document.getElementById('listaProductosEco');
    const sinProductos = document.getElementById('sinProductos');
    
    if (productosEco.length === 0) {
        container.classList.add('hidden');
        sinProductos.classList.remove('hidden');
        return;
    }
    
    container.innerHTML = '';
    sinProductos.classList.add('hidden');
    
    // Ordenar por fecha más reciente
    const productosOrdenados = [...productosEco].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    productosOrdenados.forEach(producto => {
        const fechaFormateada = new Date(producto.fecha).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
        
        const elementoProducto = document.createElement('div');
        elementoProducto.className = 'border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer';
        elementoProducto.onclick = () => mostrarDetallesProducto(producto);
        
        elementoProducto.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${producto.imagen}</div>
                    <div>
                        <div class="font-semibold text-gray-800">${producto.nombre}</div>
                        <div class="text-sm text-gray-600">${producto.categoria}</div>
                        <div class="text-xs text-gray-500 flex items-center mt-1">
                            <i class="fas fa-calendar mr-1"></i>
                            ${fechaFormateada}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-green-600 flex items-center">
                        <i class="fas fa-leaf mr-1"></i>
                        ${producto.co2Ahorrado} kg CO₂
                    </div>
                    <div class="text-sm text-gray-600">${producto.puntos} puntos</div>
                    <div class="text-xs text-gray-500">$${producto.precio.toLocaleString()}</div>
                </div>
            </div>
        `;
        
        container.appendChild(elementoProducto);
    });
}

function cargarCategoriasCO2() {
    const container = document.getElementById('categoriasCO2');
    
    // Agrupar productos por categoría
    const categorias = {};
    productosEco.forEach(producto => {
        if (!categorias[producto.categoria]) {
            categorias[producto.categoria] = {
                nombre: producto.categoria,
                co2Total: 0,
                cantidad: 0,
                color: ''
            };
        }
        categorias[producto.categoria].co2Total += producto.co2Ahorrado;
        categorias[producto.categoria].cantidad += 1;
    });
    
    // Asignar colores
    const colores = ['green', 'blue', 'purple', 'yellow', 'red', 'indigo'];
    let colorIndex = 0;
    
    const co2TotalGeneral = Object.values(categorias).reduce((sum, cat) => sum + cat.co2Total, 0);
    
    container.innerHTML = '';
    
    Object.values(categorias).forEach(categoria => {
        categoria.color = colores[colorIndex % colores.length];
        colorIndex++;
        
        const porcentaje = co2TotalGeneral > 0 ? (categoria.co2Total / co2TotalGeneral * 100) : 0;
        
        const elemento = document.createElement('div');
        elemento.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        elemento.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-${categoria.color}-500 rounded-full"></div>
                <div>
                    <div class="font-medium">${categoria.nombre}</div>
                    <div class="text-sm text-gray-600">${categoria.cantidad} productos</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-${categoria.color}-600">${categoria.co2Total.toFixed(1)} kg</div>
                <div class="text-xs text-gray-500">${porcentaje.toFixed(1)}%</div>
            </div>
        `;
        
        container.appendChild(elemento);
    });
}

function cargarLogrosAmbientales() {
    const container = document.getElementById('logrosAmbientales');
    const co2Total = productosEco.reduce((total, producto) => total + producto.co2Ahorrado, 0);
    
    const logros = [
        {
            nombre: 'Primer Ahorro',
            descripcion: 'Primera compra ECO',
            icono: 'seedling',
            conseguido: productosEco.length > 0,
            color: 'green'
        },
        {
            nombre: 'Eco Warrior',
            descripcion: '5+ kg CO₂ ahorrado',
            icono: 'shield-alt',
            conseguido: co2Total >= 5,
            color: 'blue'
        },
        {
            nombre: 'Carbon Saver',
            descripcion: '10+ kg CO₂ ahorrado',
            icono: 'award',
            conseguido: co2Total >= 10,
            color: 'purple'
        },
        {
            nombre: 'Planet Hero',
            descripción: '20+ kg CO₂ ahorrado',
            icono: 'trophy',
            conseguido: co2Total >= 20,
            color: 'yellow'
        }
    ];
    
    container.innerHTML = '';
    
    logros.forEach(logro => {
        const elemento = document.createElement('div');
        elemento.className = `text-center p-3 rounded-lg transition-all ${
            logro.conseguido ? `bg-${logro.color}-50` : 'bg-gray-100 opacity-50'
        }`;
        
        elemento.innerHTML = `
            <i class="fas fa-${logro.icono} ${
                logro.conseguido ? `text-${logro.color}-500` : 'text-gray-400'
            } text-2xl mb-2"></i>
            <div class="text-xs font-semibold ${
                logro.conseguido ? 'text-gray-800' : 'text-gray-500'
            }">${logro.nombre}</div>
            <div class="text-xs ${
                logro.conseguido ? 'text-gray-600' : 'text-gray-400'
            } mt-1">${logro.descripcion}</div>
        `;
        
        container.appendChild(elemento);
    });
}

function configurarFiltros() {
    const filtroTiempo = document.getElementById('filtroTiempo');
    filtroTiempo.addEventListener('change', (e) => {
        const periodo = e.target.value;
        filtrarProductosPorPeriodo(periodo);
    });
}

function filtrarProductosPorPeriodo(periodo) {
    const ahora = new Date();
    let fechaInicio;
    
    switch(periodo) {
        case 'mes':
            fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            break;
        case 'trimestre':
            fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
            break;
        case 'año':
            fechaInicio = new Date(ahora.getFullYear(), 0, 1);
            break;
        default:
            fechaInicio = new Date(0); // Todo el historial
    }
    
    const productosFiltrados = productosEco.filter(producto => {
        const fechaProducto = new Date(producto.fecha);
        return fechaProducto >= fechaInicio;
    });
    
    // Temporalmente actualizar la lista con productos filtrados
    const productosOriginales = [...productosEco];
    productosEco = productosFiltrados;
    cargarProductosEco();
    productosEco = productosOriginales; // Restaurar
}

function mostrarDetallesProducto(producto) {
    const modal = document.getElementById('modalDetalles');
    const contenido = document.getElementById('detalleProducto');
    
    const fechaFormateada = new Date(producto.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    contenido.innerHTML = `
        <div class="text-4xl mb-4">${producto.imagen}</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">${producto.nombre}</h3>
        <p class="text-gray-600 mb-4">${producto.descripcion}</p>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">${producto.co2Ahorrado} kg</div>
                <div class="text-xs text-gray-600">CO₂ Ahorrado</div>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">${producto.puntos}</div>
                <div class="text-xs text-gray-600">Puntos ECO</div>
            </div>
        </div>
        
        <div class="text-sm text-gray-500 mb-4">
            <div class="mb-1"><strong>Categoría:</strong> ${producto.categoria}</div>
            <div class="mb-1"><strong>Precio:</strong> $${producto.precio.toLocaleString()}</div>
            <div><strong>Fecha:</strong> ${fechaFormateada}</div>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div class="flex items-center text-green-800">
                <i class="fas fa-info-circle mr-2"></i>
                <span class="text-sm font-medium">Impacto Ambiental</span>
            </div>
            <p class="text-green-700 text-sm mt-1">
                Este producto ha evitado la emisión de <strong>${producto.co2Ahorrado} kg de CO₂</strong> 
                comparado con alternativas tradicionales.
            </p>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function cerrarModalDetalles() {
    const modal = document.getElementById('modalDetalles');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalDetalles');
    if (e.target === modal) {
        cerrarModalDetalles();
    }
});