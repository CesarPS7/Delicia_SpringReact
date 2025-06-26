import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import PromotionBanner from "../components/PromotionBanner";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";
import FloatingCartButton from "../components/FloatingCartButton";
import CartPage from "../components/CartPage";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductos } from "../services/api";

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const categoriasRef = useRef(null);     // referencia a sección de productos
  const nosotrosRef = useRef(null);       // referencia a sección "Conócenos"

  const scrollToCategorias = () => {
    categoriasRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNosotros = () => {
    nosotrosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  // Modales
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleCheckoutAttempt = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      console.log("Procesando checkout para usuario:", user);
    }
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setTimeout(() => setShowRegister(true), 150);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setTimeout(() => setShowLogin(true), 150);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="bg-white text-gray-800 overflow-hidden">
      <HeroSection
        onVerProductosClick={scrollToCategorias}
        onVerNosotrosClick={scrollToNosotros}
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Productos Estrella</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {productos.slice(0, 6).map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
            >
              <ProductCard product={product} onAdd={addToCart} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <PromotionBanner />

      <ProductList
        ref={categoriasRef}
        selectedCategoria={selectedCategoria}
        setSelectedCategoria={setSelectedCategoria}
      />

      <AboutSection ref={nosotrosRef} />

      <Footer />

      <FloatingCartButton />
      <CartPage onCheckout={handleCheckoutAttempt} />

      <LoginModal
        isOpen={showLogin}
        onClose={closeAllModals}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={closeAllModals}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default Home;
