import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import PriceChart from './components/PriceChart';
import Auth from './components/Auth';
import { fetchProducts, createProduct, fetchPriceHistory, logout } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
      () => !!localStorage.getItem('token')
  );

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0]);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedProduct?.id && isAuthenticated) {
      fetchPriceHistory(selectedProduct.id)
          .then(setHistory)
          .catch(console.error);
    }
  }, [selectedProduct, isAuthenticated]);

  const handleAddProduct = async (name, url) => {
    await createProduct({ name, url });
    await loadProducts();
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  // Si no hay token guardado, muestra el componente de Auth (Login / Registro)
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const userName = localStorage.getItem('userName');

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-indigo-400">PriceTracker AI Dashboard</h1>
            {userName && (
                <p className="text-xs text-slate-400 mt-0.5">Hola, {userName}</p>
            )}
          </div>

          <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              title="Cerrar sesión"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </header>

        <main className="max-w-7xl mx-auto">
          <ProductForm onAddProduct={handleAddProduct} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProductList
                  products={products}
                  selectedId={selectedProduct?.id}
                  onSelect={setSelectedProduct}
                  onRefresh={loadProducts}
              />
            </div>
            <div className="lg:col-span-2">
              <PriceChart product={selectedProduct} history={history} />
            </div>
          </div>
        </main>
      </div>
  );
}