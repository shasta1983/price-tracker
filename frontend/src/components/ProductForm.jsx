import React, { useState } from 'react';

export default function ProductForm({ onSubmit }) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Validar si la URL pertenece a Amazon o eBay
    const isValidUrl = (inputUrl) => {
        try {
            const parsed = new URL(inputUrl);
            const host = parsed.hostname.toLowerCase();
            return host.includes('amazon.') || host.includes('ebay.');
        } catch {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidUrl(url)) {
            setError('Por ahora solo soportamos enlaces de Amazon y eBay.');
            return;
        }

        setError('');
        onSubmit({ url, name });
        setUrl('');
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-200">Rastrear Nuevo Producto</h3>

                {/* Badges de Tiendas Soportadas */}
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
                    placeholder="https://www.amazon.com/dp/... o https://www.ebay.com/itm/..."
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError('');
                    }}
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 rounded-lg transition"
            >
                Agregar Producto
            </button>
        </form>
    );
}