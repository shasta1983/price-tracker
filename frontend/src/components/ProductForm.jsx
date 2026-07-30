import React, { useState } from 'react';

export default function ProductForm({ onSubmit }) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const cleanTrackingFromUrl = (rawUrl) => {
        if (!rawUrl) return '';

        const amazonMatch = rawUrl.match(/(?:amazon\.[a-z.]+).*(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
        if (amazonMatch) {
            return `https://www.amazon.com/dp/${amazonMatch[1]}`;
        }

        // Extracción de Item ID de eBay
        const ebayMatch = rawUrl.match(/(?:ebay\.[a-z.]+).*(?:itm\/)(?:[^\/]+\/)?(\d+)/i);
        if (ebayMatch) {
            return `https://www.ebay.com/itm/${ebayMatch[1]}`;
        }

        // Si no coincide con los patrones exactos pero es URL válida, quita los query params (?ref=...)
        try {
            const parsed = new URL(rawUrl);
            return `${parsed.origin}${parsed.pathname}`;
        } catch {
            return rawUrl;
        }
    };

    const handleUrlChange = (e) => {
        const value = e.target.value;
        // Si el usuario pega una URL larga de Amazon/eBay, la limpia automáticamente al instante
        const cleaned = cleanTrackingFromUrl(value);
        setUrl(cleaned);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Por favor ingresa una URL');
            return;
        }

        // Normalización final antes del envío
        const finalUrl = cleanTrackingFromUrl(url);

        if (!finalUrl.includes('amazon.') && !finalUrl.includes('ebay.')) {
            setError('Por favor ingresa un enlace válido de Amazon o eBay');
            return;
        }

        try {
            // Dispara la petición pasándole la URL limpia al handler padre
            await onSubmit({ url: finalUrl, name });
            setUrl('');
            setName('');
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-200">Rastrear Nuevo Producto</h3>

                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">Plataformas soportadas:</span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
            Amazon
          </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
            eBay
          </span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">URL del Producto</label>
                <input
                    type="url"
                    required
                    placeholder="Pega aquí el enlace de Amazon o eBay..."
                    value={url}
                    onChange={handleUrlChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nombre (Opcional)</label>
                <input
                    type="text"
                    placeholder="Ej: Adidas Samba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 rounded-lg transition cursor-pointer"
            >
                Agregar Producto
            </button>
        </form>
    );
}