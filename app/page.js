// archivo: app/page.js (VERSIÓN FINAL DEL DASHBOARD)
'use client'; 

import { useState } from 'react';
import AgregarProducto from '../components/AgregarProducto';
import ListaInventario from '../components/ListaInventario';
import RegistrarVenta from '../components/RegistrarVenta';
import ResumenGanancias from '../components/ResumenGanancias'; // <-- Importado
import ListaVentas from '../components/ListaVentas'; // <-- Importado

export default function Home() {
  // Estados para forzar la recarga de todos los módulos
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleRefresh = () => {
    // Incrementa la llave, forzando la recarga de todos los componentes de datos
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
            <RegistrarVenta onVentaRegistrada={handleRefresh} />
            <AgregarProducto onProductoAgregado={handleRefresh} />
        </div>

        {/* Columna Derecha (66%): Inventario y Historial */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Inventario */}
            <ListaInventario refreshToggle={refreshKey} />
            
            {/* Historial de Ventas */}
            <ListaVentas refreshToggle={refreshKey} />
            
        </div>
      </div>
    </main>
  );
}