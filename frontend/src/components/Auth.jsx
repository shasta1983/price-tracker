import React, { useState } from 'react';

export default function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin
            ? { email, password }
            : { name, email, password };

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ocurrió un error en la solicitud');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }
                onAuthSuccess();
            } else {
                throw new Error('No se recibió el token de autenticación');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (loginState) => {
        setIsLogin(loginState);
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">

                {/* Branding Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-indigo-400">PriceTracker AI</h1>
                    <p className="text-slate-400 text-xs mt-1">
                        {isLogin ? 'Ingresa tus credenciales para continuar' : 'Crea tu cuenta para comenzar a monitorear'}
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
                    <button
                        type="button"
                        onClick={() => toggleMode(true)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            isLogin
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleMode(false)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            !isLogin
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                            <input
                                type="text"
                                required={!isLogin}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Tu nombre o alias"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-all mt-2 cursor-pointer"
                    >
                        {loading
                            ? 'Procesando...'
                            : isLogin
                                ? 'Iniciar Sesión'
                                : 'Crear Cuenta'}
                    </button>
                </form>
            </div>
        </div>
    );
}