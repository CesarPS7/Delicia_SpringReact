import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../Pages/LoginModal';
import RegisterModal from '../Pages/RegisterModal';
import ModalVenta from '../Pages/ModalVenta';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const { cliente, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showModalVenta, setShowModalVenta] = useState(false);
  const [quierePagar, setQuierePagar] = useState(false); // <-- Nueva bandera

  // ✅ Activar ModalVenta si el cliente se logueó después de querer pagar
  useEffect(() => {
    if (cliente && quierePagar) {
      setShowLoginModal(false);
      setShowRegisterModal(false);
      setShowModalVenta(true);
      setQuierePagar(false);
    }
  }, [cliente]);

  const handleCheckout = () => {
    if (!cliente) {
      setQuierePagar(true);
      setIsCartOpen(false);
      setShowLoginModal(true);
      return;
    }
    setIsCartOpen(false);
    setShowModalVenta(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-transparent"
              onClick={() => setIsCartOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white/95 shadow-2xl z-50 flex flex-col backdrop-blur-sm"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tu Carrito <span className="text-orange-500">({totalItems})</span>
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaShoppingCart className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Tu carrito está vacío</h3>
                    <p className="text-gray-500 mb-6">Agrega productos para comenzar</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Explorar productos <FaArrowRight className="ml-2" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-gray-100"
                  >
                    {cart.map(item => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: 'spring' }}
                        className="p-4"
                      >
                        <div className="flex gap-4">
                          <div className="relative">
                            <img
                              src={item.image || `https://source.unsplash.com/featured/?${item.name}`}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="font-bold text-orange-500">
                                S/ {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">S/ {item.price.toFixed(2)} c/u</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <span className="px-3 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>

              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-gray-100 p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-center text-lg font-bold mb-6">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-orange-500">S/ {totalPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    Proceder al pago <FaArrowRight />
                  </button>

                  {cliente && (
                    <button
                      onClick={() => {
                        logout();
                        alert("Sesión cerrada");
                        setIsCartOpen(false);
                      }}
                      className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-all"
                    >
                      Cerrar sesión
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={closeAllModals}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={closeAllModals}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* ✅ Modal de Venta */}
      <ModalVenta
        isOpen={showModalVenta}
        onClose={() => setShowModalVenta(false)}
        cliente={cliente}
        carrito={cart}
        total={totalPrice}
      />
    </>
  );
};

export default CartPage;