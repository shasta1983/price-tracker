import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import PriceChart from './components/PriceChart';
import { fetchProducts, createProduct, fetchPriceHistory } from './services/api';

export default function App() {
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
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct?.id) {
      fetchPriceHistory(selectedProduct.id)
          .then(setHistory)
          .catch(console.error);
    }
  }, [selectedProduct]);

  const handleAddProduct = async (name, url) => {
    await createProduct({ name, url });
    await loadProducts();
  };

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-indigo-400">PriceTracker AI Dashboard</h1>
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