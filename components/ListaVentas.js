// archivo: components/ListaVentas.js
'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaSpinner } from 'react-icons/fa'; 

const ListaVentas = ({ refreshToggle, onVentaEliminada }) => { 
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null); 
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Función para cargar los datos del inventario
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

    // Función para ELIMINAR VENTA
    const handleDeleteVenta = async (ventaId) => {
        if (!confirm('⚠️ ¿Estás seguro de eliminar esta venta? Se REVERTIRÁ el stock y se eliminará el registro de ganancias.')) {
            return;
        }

        setDeletingId(ventaId);
        try {
            await axios.delete(`${API_URL}/ventas/${ventaId}`); 
            
            alert('Venta eliminada y stock revertido con éxito.');
            onVentaEliminada(); 
            
        } catch (error) {
            console.error('Error al eliminar venta:', error.response ? error.response.data : error.message);
            alert(`❌ Error al eliminar venta: ${error.response?.data?.message || 'Error desconocido'}`);
        } finally {
            setDeletingId(null);
        }
    };


    useEffect(() => {
        fetchVentas();
    }, [fetchVentas, refreshToggle]);

    if (loading) return <div className="text-center p-4"><FaSpinner className="animate-spin inline mr-2" /> Cargando historial de ventas...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
    if (ventas.length === 0) return <div className="text-center p-4 text-gray-500">Aún no hay ventas registradas.</div>;

    const formatCurrency = (amount) => `S/${parseFloat(amount).toFixed(2)}`;

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🧾 Historial de Transacciones</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">ID / Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Cliente / Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Detalles</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">Ganancia Neta</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">Acción</th> 
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{venta.id} <br/> 
                                <span className="text-xs text-gray-500">{new Date(venta.fecha_venta).toLocaleDateString()}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {venta.cliente_nombre || 'N/A'} <br/>
                                <span className={`text-xs font-semibold ${venta.estado === 'Pagada' ? 'text-green-600' : 'text-orange-600'}`}>{venta.estado}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                                {venta.detalles.map(d => (
                                    <div key={d.id} className="text-xs">
                                        {d.cantidad}x {d.Producto.nombre} @ {formatCurrency(d.precio_final_unitario)}
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-extrabold text-gray-900">{formatCurrency(venta.total_pagado)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-extrabold text-green-700">{formatCurrency(venta.ganancia_neta)}</td>

                            {/* NUEVO BOTÓN DE ACCIÓN */}
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDeleteVenta(venta.id)}
                                    disabled={deletingId === venta.id || deletingId !== null}
                                    className="text-red-600 hover:text-red-800 disabled:text-gray-400 p-2 transition duration-150"
                                    title="Eliminar Venta y Revertir Stock"
                                >
                                    {deletingId === venta.id ? (
                                        <FaSpinner className="animate-spin text-lg" />
                                    ) : (
                                        <FaTrashAlt className="text-lg" />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaVentas;