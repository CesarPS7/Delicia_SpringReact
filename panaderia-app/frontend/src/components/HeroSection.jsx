import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../Pages/LoginModal";
import RegisterModal from "../Pages/RegisterModal";

const HeroSection = ({ onVerProductosClick, onVerNosotrosClick }) => {
  const { cliente, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
    <div className="relative h-screen bg-[url('https://mae-innovation.com/wp-content/uploads/2023/03/pexels-igor-ovsyannykov-205961.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-orange-400">Pastelería</span> Delicia
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={onVerProductosClick} className="hover:text-orange-400 transition">
              Productos
            </button>
            <button onClick={onVerNosotrosClick} className="hover:text-orange-400 transition">
              Conócenos
            </button>
            <a href="#contacto" className="hover:text-orange-400 transition">Contacto</a>

            {cliente && (
              <button
                onClick={() => logout()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white animate-fade-in">
            Bienvenidos a, <span className="text-orange-400">Delicia</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white opacity-90">
            Donde tenemos productos artesanales, hechos con amor cada día ❤️
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onVerProductosClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Productos
            </button>
            <button
              onClick={onVerNosotrosClick}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Conócenos
            </button>
          </div>
        </div>
      </div>

      {/* Flecha indicadora */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Modales */}
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
    </div>
  );
};

export default HeroSection;
