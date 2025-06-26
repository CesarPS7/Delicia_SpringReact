import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Imagen del producto */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imagenUrl || `https://source.unsplash.com/featured/?${product.nombre}`}
          alt={product.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {/* Descuento */}
        {product.descuento && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.descuento}%
          </div>
        )}
      </div>

      {/* Detalles del producto */}
      <div className="p-5">
        {/* Nombre y categoría */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{product.nombre}</h3>
          <span className="text-sm text-gray-500">{product.categoria}</span>
        </div>

        {/* Descripción del producto */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descripcion}</p>

        {/* Precio y botón de agregar */}
        <div className="flex justify-between items-center">
          <div>
            {product.precioOriginal && (
              <span className="text-sm text-gray-400 line-through mr-2">
                S/ {product.precioOriginal.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold text-orange-500">
              S/ {product.precio.toFixed(2)}
            </span>
          </div>

          {/* Botón de añadir al carrito */}
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.nombre,
                price: Number(product.precio) || 0,
                image: product.imagenUrl || `https://source.unsplash.com/featured/?${product.nombre}`,
                quantity: 1,
              })
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
