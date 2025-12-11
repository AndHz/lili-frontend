// archivo: components/AgregarProducto.js
'use client'; 

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

        const dataToSend = {
            ...formData,
            costo_compra: parseFloat(formData.costo_compra),
            precio_sugerido: parseFloat(formData.precio_sugerido),
            cantidad_stock: parseInt(formData.cantidad_stock, 10),
        };

        try {
            const response = await axios.post(`${API_URL}/productos`, dataToSend);
            setMessage(`✅ Producto ${response.data.producto.nombre} agregado con éxito.`);
            
            setFormData({
                nombre: '', marca: 'Yanbal', codigo_catalogo: '', costo_compra: '', 
                precio_sugerido: '', cantidad_stock: 0, ubicacion: '',
            });
            onProductoAgregado(); 

        } catch (error) {
            console.error('Error al agregar producto:', error.response ? error.response.data : error.message);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Clases para mejorar la legibilidad del INPUT
    const inputClasses = "p-2 border rounded text-gray-800 placeholder:text-gray-500";

    return (
        <div className="p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">🛒 Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del Producto" required className={inputClasses} />
                <input type="text" name="codigo_catalogo" value={formData.codigo_catalogo} onChange={handleChange} placeholder="Código de Catálogo" required className={inputClasses} />
                
                <select name="marca" value={formData.marca} onChange={handleChange} className={`p-2 border rounded bg-white text-gray-800`} required>
                    <option value="Yanbal">Yanbal</option>
                    <option value="Esika">Esika</option>
                    <option value="Cyzone">Cyzone</option>
                    <option value="Lbel">L'Bel</option>
                    <option value="Otra">Otra</option>
                </select>

                <input type="number" name="costo_compra" value={formData.costo_compra} onChange={handleChange} placeholder="Costo de Compra (S/)" required step="0.01" className={inputClasses} />
                <input type="number" name="precio_sugerido" value={formData.precio_sugerido} onChange={handleChange} placeholder="Precio Venta Sugerido ($)" step="0.01" className={inputClasses} />
                <input type="number" name="cantidad_stock" value={formData.cantidad_stock} onChange={handleChange} placeholder="Stock Inicial" required className={inputClasses} />
                <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ubicación (Caja/Estante)" className={inputClasses} />

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