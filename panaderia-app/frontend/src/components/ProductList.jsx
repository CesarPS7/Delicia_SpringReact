import { motion } from "framer-motion";
import { useEffect, useState, forwardRef } from 'react';
import CategoriesMenu from './CategoriesMenu';
import ProductCard from './ProductCard';

const ProductList = forwardRef(({ selectedCategoria, setSelectedCategoria }, ref) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [productosRes, categoriasRes] = await Promise.all([
          fetch('http://localhost:8080/api/productos'),
          fetch('http://localhost:8080/api/categorias')
        ]);

        if (!productosRes.ok || !categoriasRes.ok) {
          throw new Error("Error al cargar productos o categorías");
        }

        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();

        setProductos(Array.isArray(productosData) ? productosData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const productosFiltrados = selectedCategoria
    ? productos.filter((p) => p.categoriaId === selectedCategoria)
    : productos;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 px-4">
        <div className="text-red-500 text-center mb-4">
          <h3 className="text-xl font-bold mb-2">Error al cargar los datos</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section ref={ref} className="bg-gray-50 pb-20 pt-10">
      <CategoriesMenu
        categorias={categorias}
        onSelectCategoria={setSelectedCategoria}
        selectedCategoria={selectedCategoria}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {productosFiltrados.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={prod} onAdd={() => {}} />
            </motion.div>
          ))}
        </motion.div>

        {productosFiltrados.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-xl font-medium text-gray-500">
              {productos.length === 0 
                ? "No hay productos disponibles" 
                : "No se encontraron productos en esta categoría"
              }
            </h3>
          </motion.div>
        )}
      </div>
    </section>
  );
});

export default ProductList;
