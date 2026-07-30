import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm'; // <-- Asegúrate de tener esta importación
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

  const loadProducts = () => {
    fetchProducts()
        .then((data) => {
          setProducts(data);
          if (data.length > 0 && !selectedProduct) setSelectedProduct(data[0]);
        })
        .catch((err) => {
          if (err.message === 'SESSION_EXPIRED') {
            logout();
            setIsAuthenticated(false);
          }
        });
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
          .catch(() => setHistory([]));
    }
  }, [selectedProduct, isAuthenticated]);

  // Manejador para cuando se crea el producto desde el formulario
  const handleCreateProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      loadProducts(); // Recarga la lista para que aparezca el nuevo producto
      setSelectedProduct(newProduct); // Lo selecciona automáticamente
    } catch (err) {
      alert('No se pudo crear el producto: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-indigo-400">PriceTracker AI Dashboard</h1>
          <button
              onClick={handleLogout}
              className="bg-slate-900 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProductForm onSubmit={handleCreateProduct} />

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