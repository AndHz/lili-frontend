// archivo: components/ListaInventario.js
'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ListaInventario = ({ refreshToggle }) => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Función para cargar los datos del inventario
    const fetchInventario = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/productos`);
            setInventario(response.data);
            
        } catch (err) {
            console.error('Error al cargar el inventario:', err);
            setError('Fallo al conectar con el servidor o al cargar los datos.');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Usamos useEffect para cargar los datos la primera vez y cuando haya un cambio (refreshToggle)
    useEffect(() => {
        fetchInventario();
    }, [fetchInventario, refreshToggle]);

    if (loading) return <div className="text-center p-4">Cargando inventario...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
    if (inventario.length === 0) return <div className="text-center p-4 text-gray-500">Aún no hay productos en el inventario.</div>;


    return (
        <div className="bg-white p-6 shadow-xl rounded-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Stock Actual</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre / Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sugerido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {inventario.map((producto) => (
                        <tr key={producto.id} className={producto.Inventario?.cantidad_stock <= 5 ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {producto.nombre} <br/> <span className="text-xs text-gray-500">{producto.codigo_catalogo}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.marca}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(producto.costo_compra).toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(producto.precio_sugerido).toFixed(2)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${producto.Inventario?.cantidad_stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                                {producto.Inventario?.cantidad_stock || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.Inventario?.ubicacion || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaInventario;