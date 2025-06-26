import { motion } from "framer-motion";
import { forwardRef } from "react";

const CategoriesMenu = forwardRef(({ categorias = [], onSelectCategoria, selectedCategoria = null }, ref) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <section ref={ref} className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Nuestras Categorías</h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {/* Botón "Todos" */}
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={() => onSelectCategoria(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategoria === null 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 shadow-md hover:bg-gray-100'
            }`}
          >
            Todos
          </motion.button>

          {/* Botones de categoría */}
          {categorias.map(cat => (
            <motion.button
              key={cat.id}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => onSelectCategoria(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategoria === cat.id 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 shadow-md hover:bg-gray-100'
              }`}
            >
              {cat.nombre}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CategoriesMenu;
