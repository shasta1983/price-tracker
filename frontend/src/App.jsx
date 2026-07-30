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
  const [errorNotification, setErrorNotification] = useState(null);

  const handleAuthError = (err) => {
    if (err.message === 'SESSION_EXPIRED') {
      logout();
      setIsAuthenticated(false);
    } else {
      console.error('Fallo en la petición:', err.message);
      setErrorNotification('Ocurrió un error al cargar algunos datos.');
    }
  };

  // Cargar lista de productos al iniciar
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
          .then((data) => {
            setProducts(data);
            if (data.length > 0 && !selectedProduct) setSelectedProduct(data[0]);
          })
          .catch(handleAuthError);
    }
  }, [isAuthenticated]);

  // Cargar historial de un producto (Fallo independiente)
  useEffect(() => {
    if (selectedProduct?.id && isAuthenticated) {
      fetchPriceHistory(selectedProduct.id)
          .then(setHistory)
          .catch((err) => {
            console.warn(`No se pudo cargar el historial del producto ${selectedProduct.id}:`, err);
            setHistory([]); // Simplemente vaciamos el gráfico sin cerrar la sesión
          });
    }
  }, [selectedProduct, isAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        {errorNotification && (
            <div className="max-w-7xl mx-auto mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg flex justify-between">
              <span>{errorNotification}</span>
              <button onClick={() => setErrorNotification(null)}>✕</button>
            </div>
        )}

        <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-indigo-400">PriceTracker AI Dashboard</h1>
          <button
              onClick={handleLogout}
              className="bg-slate-900 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductList
                products={products}
                selectedId={selectedProduct?.id}
                onSelect={setSelectedProduct}
            />
          </div>
          <div className="lg:col-span-2">
            <PriceChart product={selectedProduct} history={history} />
          </div>
        </main>
      </div>
  );
}