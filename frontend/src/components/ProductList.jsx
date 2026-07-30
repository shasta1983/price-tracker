import React from 'react';

export default function ProductList({ products, selectedId, onSelect, onRefresh }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Productos ({products.length})</h3>
                <button onClick={onRefresh} className="text-xs text-indigo-400 hover:underline">
                    🔄 Recargar
                </button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                {products.map((p) => {
                    const isSelected = p.id === selectedId;
                    return (
                        <div
                            key={p.id}
                            onClick={() => onSelect(p)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                    ? 'bg-indigo-950/50 border-indigo-500 text-white'
                                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm truncate">{p.name || 'Sin título'}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase font-bold">
                  {p.platform || 'STORE'}
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}