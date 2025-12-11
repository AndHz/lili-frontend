// archivo: components/ListaVentas.js
'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ListaVentas = ({ refreshToggle }) => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchVentas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/ventas`);
            setVentas(response.data);
            
        } catch (err) {
            console.error('Error al cargar ventas:', err);
            setError('Fallo al cargar el historial de ventas.');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas, refreshToggle]);

    if (loading) return <div className="text-center p-4">Cargando historial de ventas...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
    if (ventas.length === 0) return <div className="text-center p-4 text-gray-500">Aún no hay ventas registradas.</div>;

    const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🧾 Historial de Transacciones</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente / Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ganancia Neta</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{venta.id} <br/> 
                                <span className="text-xs text-gray-500">{new Date(venta.fecha_venta).toLocaleDateString()}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {venta.cliente_nombre || 'N/A'} <br/>
                                <span className={`text-xs font-semibold ${venta.estado === 'Pagada' ? 'text-green-500' : 'text-orange-500'}`}>{venta.estado}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                                {venta.detalles.map(d => (
                                    <div key={d.id} className="text-xs">
                                        {d.cantidad}x {d.Producto.nombre} @ {formatCurrency(d.precio_final_unitario)}
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold">{formatCurrency(venta.total_pagado)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-green-700">{formatCurrency(venta.ganancia_neta)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaVentas;