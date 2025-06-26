import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false); // nuevo estado

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      setShowWelcomeMessage(true); // mostrar mensaje
      setTimeout(() => setShowWelcomeMessage(false), 3000); // ocultar a los 3s

      onClose();
      setEmail("");
      setPassword("");
    } else {
      alert("Login fallido");
    }
  };

  const handleSwitchToRegister = () => {
    setEmail("");
    setPassword("");
    onSwitchToRegister();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed z-50 top-1/2 left-1/2 w-full max-w-sm bg-white rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-center text-orange-500 flex-1">
                  Iniciar Sesión
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  Iniciar sesión
                </button>
              </form>
              <p className="mt-4 text-sm text-center text-gray-600">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={handleSwitchToRegister}
                  className="text-orange-500 hover:underline font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Toast de bienvenida */}
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]"
          >
            ¡Bienvenido de nuevo!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
