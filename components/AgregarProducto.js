// archivo: components/AgregarProducto.js
'use client'; // Esto es necesario para usar estados y eventos en Next.js App Router

import React, { useState } from 'react';
import axios from 'axios';

const AgregarProducto = ({ onProductoAgregado }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: 'Yanbal',
        codigo_catalogo: '',
        costo_compra: '',
        precio_sugerido: '',
        cantidad_stock: 0,
        ubicacion: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Convertir strings a números (importante para el Backend)
        const dataToSend = {
            ...formData,
            costo_compra: parseFloat(formData.costo_compra),
            precio_sugerido: parseFloat(formData.precio_sugerido),
            cantidad_stock: parseInt(formData.cantidad_stock, 10),
        };

        try {
            const response = await axios.post(`${API_URL}/productos`, dataToSend);
            setMessage(`✅ Producto ${response.data.producto.nombre} agregado con éxito!`);
            
            // Limpiar formulario y notificar al padre
            setFormData({
                nombre: '', marca: 'Yanbal', codigo_catalogo: '', costo_compra: '', 
                precio_sugerido: '', cantidad_stock: 0, ubicacion: '',
            });
            onProductoAgregado(); // Función para actualizar la tabla de inventario

        } catch (error) {
            console.error('Error al agregar producto:', error.response ? error.response.data : error.message);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">🛒 Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Campos de texto */}
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del Producto" required className="p-2 border rounded" />
                <input type="text" name="codigo_catalogo" value={formData.codigo_catalogo} onChange={handleChange} placeholder="Código de Catálogo" required className="p-2 border rounded" />
                
                {/* Campo de Marca (Dropdown) */}
                <select name="marca" value={formData.marca} onChange={handleChange} className="p-2 border rounded bg-white" required>
                    <option value="Yanbal">Yanbal</option>
                    <option value="Esika">Esika</option>
                    <option value="Cyzone">Cyzone</option>
                    <option value="Lbel">L'Bel</option>
                    <option value="Otra">Otra</option>
                </select>

                {/* Campos numéricos */}
                <input type="number" name="costo_compra" value={formData.costo_compra} onChange={handleChange} placeholder="Costo de Compra ($)" required step="0.01" className="p-2 border rounded" />
                <input type="number" name="precio_sugerido" value={formData.precio_sugerido} onChange={handleChange} placeholder="Precio Venta Sugerido ($)" step="0.01" className="p-2 border rounded" />
                <input type="number" name="cantidad_stock" value={formData.cantidad_stock} onChange={handleChange} placeholder="Stock Inicial" required className="p-2 border rounded" />
                <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ubicación (Caja/Estante)" className="p-2 border rounded" />

                {/* Botón de envío y mensaje */}
                <div className="col-span-2">
                    <button type="submit" disabled={loading} className="w-full p-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 disabled:bg-gray-400 transition">
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                    {message && (
                        <p className={`mt-2 text-center text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AgregarProducto;