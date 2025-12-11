// archivo: app/page.js (CÓDIGO COMPLETO Y FINAL DEL DASHBOARD)
'use client'; 

import { useState } from 'react';
// Importamos todos los componentes necesarios para el Dashboard
import AgregarProducto from '../components/AgregarProducto';
import ListaInventario from '../components/ListaInventario';
import RegistrarVenta from '../components/RegistrarVenta';
import ResumenGanancias from '../components/ResumenGanancias';
import ListaVentas from '../components/ListaVentas'; 

export default function Home() {
  // Estado que actúa como un "interruptor" para forzar la recarga de todos los módulos de datos
  const [refreshKey, setRefreshKey] = useState(0); 

  // Función que se pasa a los componentes para notificar que una acción crítica ha ocurrido
  const handleRefresh = () => {
    // Incrementa la llave, forzando la recarga de todos los componentes que usan refreshKey
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-purple-800 border-b pb-2">
        💜 Panel de Gestión de Catálogos
      </h1>

      <div className="mb-6 flex justify-between">
          <button 
              onClick={handleRefresh}
              className="p-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
              title="Recarga todos los reportes y tablas"
          >
              🔄 Recargar Datos (Refrescar)
          </button>
      </div>

      {/* 1. MÓDULO DE REPORTES Y GANANCIAS */}
      <div className="mb-8">
          <ResumenGanancias refreshToggle={refreshKey} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (33%): Registro de Transacciones */}
        <div className="lg:col-span-1 space-y-8">
            {/* Si registras una venta, recarga todo */}
            <RegistrarVenta onVentaRegistrada={handleRefresh} />
            
            {/* Si agregas un producto, recarga todo (especialmente el inventario) */}
            <AgregarProducto onProductoAgregado={handleRefresh} />
        </div>

        {/* Columna Derecha (66%): Inventario y Historial */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Inventario: Recarga si algo cambia (Venta o Nuevo Producto) */}
            <ListaInventario refreshToggle={refreshKey} />
            
            {/* Historial de Ventas: Recarga si algo cambia */}
            <ListaVentas 
                refreshToggle={refreshKey} 
                onVentaEliminada={handleRefresh} // <-- Si se elimina una venta, recarga todo
            />
            
        </div>
      </div>
    </main>
  );
}