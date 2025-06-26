import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCartButton = () => {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <AnimatePresence>
      <motion.button
        onClick={toggleCart}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center group"
        style={{
          boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)'
        }}
      >
        <AnimatePresence mode="wait">
          {isCartOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="text-xl" />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaShoppingCart className="text-xl" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isCartOpen ? 'Cerrar carrito' : 'Ver carrito'}
        </span>
      </motion.button>
    </AnimatePresence>
  );
};

export default FloatingCartButton;