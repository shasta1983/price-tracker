import React, { useState } from 'react';
import { cleanProductUrl } from '../utils/urlCleaner';

export default function ProductForm({ onAddProduct }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Limpia automáticamente cuando el usuario pega un enlace
    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text');
        if (pastedData) {
            e.preventDefault();
            const cleaned = cleanProductUrl(pastedData);
            setUrl(cleaned);
        }
    };

    // 2. Opcional: Limpia si el usuario modifica el texto y pierde el foco
    const handleBlur = () => {
        if (url.trim()) {
            setUrl(cleanProductUrl(url));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        // 3. Sanitizado final por seguridad antes de enviar al parent / backend
        const cleanUrlToSend = cleanProductUrl(url);

        setLoading(true);
        try {
            await onAddProduct(name, cleanUrlToSend);
            setName('');
            setUrl('');
        } catch (err) {
            alert('Error al enviar la URL al backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                ➕ Monitorear Nuevo Producto
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Nombre del producto (ej: Adidas Samba)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
                <input
                    type="url"
                    required
                    placeholder="https://www.amazon.com/dp/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    className="flex-[2] bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg text-sm transition-all"
                >
                    {loading ? 'Encolando...' : 'Guardar'}
                </button>
            </form>
        </div>
    );
}