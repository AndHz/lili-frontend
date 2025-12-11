// archivo: components/RegistrarVenta.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RegistrarVenta = ({ onVentaRegistrada }) => {
    const [productos, setProductos] = useState([]); 
    const [venta, setVenta] = useState({
        cliente_nombre: '',
        estado: 'Pagada',
        detalles: [], 
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // --- Cargar Inventario Disponible ---
    const fetchProductos = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/productos`);
            setProductos(response.data.filter(p => p.Inventario?.cantidad_stock > 0));
        } catch (error) {
            console.error('Error al cargar productos para la venta:', error);
            setMessage('❌ Error al cargar inventario para la venta.');
        }
    }, [API_URL]);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    // --- Manejo del Formulario de Venta ---

    const handleInputChange = (e) => {
        setVenta({ ...venta, [e.target.name]: e.target.value });
    };

    const handleAgregarDetalle = () => {
        setVenta({
            ...venta,
            detalles: [...venta.detalles, { 
                productoId: '', 
                cantidad: 1, 
                precio_final_unitario: 0 
            }],
        });
    };

    const handleDetalleChange = (index, name, value) => {
        const list = [...venta.detalles];
        list[index][name] = value;
        
        if (name === 'productoId' && value) {
            const productoSeleccionado = productos.find(p => p.id == value);
            if (productoSeleccionado) {
                list[index].precio_final_unitario = parseFloat(productoSeleccionado.precio_sugerido || 0);
            }
        }
        
        setVenta({ ...venta, detalles: list });
    };

    const handleRemoverDetalle = (index) => {
        const list = [...venta.detalles];
        list.splice(index, 1);
        setVenta({ ...venta, detalles: list });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const dataToSend = {
            ...venta,
            detalles: venta.detalles.map(d => ({
                ...d,
                productoId: parseInt(d.productoId, 10),
                cantidad: parseInt(d.cantidad, 10),
                precio_final_unitario: parseFloat(d.precio_final_unitario),
            })).filter(d => d.productoId && d.cantidad > 0), 
        };
        
        if (dataToSend.detalles.length === 0) {
            setMessage('❌ La venta debe tener al menos un producto.');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/ventas`, dataToSend);
            setMessage('✅ Venta registrada y stock actualizado con éxito!');
            
            setVenta({ cliente_nombre: '', estado: 'Pagada', detalles: [] });
            onVentaRegistrada(); 

        } catch (error) {
            console.error('Error al registrar venta:', error.response ? error.response.data : error.message);
            setMessage(`❌ Error al registrar venta: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const totales = venta.detalles.reduce((acc, detalle) => {
        const cantidad = parseFloat(detalle.cantidad) || 0;
        const precio = parseFloat(detalle.precio_final_unitario) || 0;
        acc.subtotal += cantidad * precio;
        return acc;
    }, { subtotal: 0 });

    const inputClasses = "p-2 border rounded text-gray-800 placeholder:text-gray-500";


    return (
        <div className="p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-700">💵 Registrar Venta</h2>
            <form onSubmit={handleSubmit}>
                {/* Cabecera de la Venta */}
                <div className="grid grid-cols-2 gap-4 mb-4 border-b pb-4">
                    <input
                        type="text"
                        name="cliente_nombre"
                        value={venta.cliente_nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre del Cliente (Opcional)"
                        className={inputClasses}
                    />
                    <select
                        name="estado"
                        value={venta.estado}
                        onChange={handleInputChange}
                        className="p-2 border rounded bg-white text-gray-800"
                        required
                    >
                        <option value="Pagada">Pagada</option>
                        <option value="Pendiente Pago">Pendiente Pago</option>
                        <option value="Entregada">Entregada</option>
                    </select>
                </div>

                {/* Detalles de la Venta (Líneas de Producto) */}
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Artículos:</h3>
                <div className="space-y-3 mb-4">
                    {venta.detalles.map((detalle, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                            {/* Selector de Producto */}
                            <select
                                value={detalle.productoId}
                                onChange={(e) => handleDetalleChange(index, 'productoId', e.target.value)}
                                className="p-2 border rounded flex-1 bg-white text-gray-800"
                                required
                            >
                                <option value="">--- Seleccionar Producto ---</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {`${p.nombre} (${p.Inventario.cantidad_stock} en stock)`}
                                    </option>
                                ))}
                            </select>

                            {/* Cantidad */}
                            <input
                                type="number"
                                value={detalle.cantidad}
                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                                placeholder="Cant."
                                min="1"
                                className="w-16 p-2 border rounded text-center text-gray-800"
                                required
                            />

                            {/* Precio Final */}
                            <input
                                type="number"
                                value={detalle.precio_final_unitario}
                                onChange={(e) => handleDetalleChange(index, 'precio_final_unitario', e.target.value)}
                                placeholder="Precio Final"
                                step="0.01"
                                className="w-24 p-2 border rounded text-gray-800"
                                required
                            />
                            
                            {/* Botón Remover */}
                            <button
                                type="button"
                                onClick={() => handleRemoverDetalle(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                {/* Botón Agregar Línea */}
                <button
                    type="button"
                    onClick={handleAgregarDetalle}
                    className="w-full p-2 mb-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                >
                    + Agregar Artículo
                </button>
                
                {/* Totales y Envío */}
                <div className="border-t pt-3 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Total Venta: S/{totales.subtotal.toFixed(2)}</h3>
                    <button
                        type="submit"
                        disabled={loading || totales.subtotal === 0}
                        className="p-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Venta'}
                    </button>
                </div>
                
                {message && (
                    <p className={`mt-2 text-center text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default RegistrarVenta;