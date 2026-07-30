import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PriceChart({ product, history }) {
    if (!product) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 h-[500px] flex items-center justify-center text-slate-500">
                Selecciona un producto de la lista para ver su historial de precios.
            </div>
        );
    }

    const data = history.map((item) => ({
        time: new Date(item.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: item.price,
    }));

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-[500px] flex flex-col">
            <h3 className="text-base font-semibold text-slate-100 mb-1">{product.name}</h3>
            <p className="text-xs text-slate-400 mb-4">Histórico de precios registrado por el scraping worker</p>

            <div className="flex-1 w-full min-h-0">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} unit="$" />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                            <Area type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={2} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        Aún no hay registros de precios para este producto.
                    </div>
                )}
            </div>
        </div>
    );
}