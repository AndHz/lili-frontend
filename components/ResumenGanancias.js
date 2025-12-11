// archivo: components/ResumenGanancias.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ResumenGanancias = ({ refreshToggle }) => {
    const [resumen, setResumen] = useState({
        gananciaNetaTotal: 0,
        totalVentasBruto: 0,
        totalTransacciones: 0,
    });
    const [valorInventario, setValorInventario] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchReportes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtener Resumen Financiero
            const resumenResponse = await axios.get(`${API_URL}/reportes/resumen`);
            setResumen(resumenResponse.data);

            // 2. Obtener Valoración del Inventario
            const invValoradoResponse = await axios.get(`${API_URL}/reportes/inventario-valorado`);
            setValorInventario(invValoradoResponse.data.valorTotalInventario);

        } catch (err) {
            console.error('Error al cargar reportes:', err);
            setError('Fallo al conectar o calcular reportes financieros.');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchReportes();
    }, [fetchReportes, refreshToggle]);

    if (loading) return <div className="text-center p-4">Calculando ganancias...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    const stats = [
        { label: "Ganancia Neta Total", value: `$${parseFloat(resumen.gananciaNetaTotal).toFixed(2)}`, color: 'text-green-600', icon: '📈' },
        { label: "Ventas Totales (Bruto)", value: `$${parseFloat(resumen.totalVentasBruto).toFixed(2)}`, color: 'text-blue-600', icon: '💸' },
        { label: "Valor Actual de Inventario", value: `$${parseFloat(valorInventario).toFixed(2)}`, color: 'text-yellow-600', icon: '📦' },
        { label: "Transacciones Registradas", value: resumen.totalTransacciones, color: 'text-purple-600', icon: '🧾' },
    ];

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Reporte Financiero</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="border p-4 rounded-lg bg-gray-50 text-center">
                        <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.icon} {stat.value}</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
            {/*  */}
            <p className="mt-4 text-sm text-gray-500">
                
            </p>
        </div>
    );
};

export default ResumenGanancias;