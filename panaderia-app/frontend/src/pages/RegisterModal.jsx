import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombre: "", 
    apellido: "", 
    email: "", 
    password: "", 
    telefono: "", 
    direccion: "", 
    dni: "", 
    genero: "Masculino"
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // ✅ nuevo estado

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(form);
    if (success) {
      setShowSuccessMessage(true); // ✅ mostrar mensaje
      setTimeout(() => setShowSuccessMessage(false), 3000); // ocultar en 3s

      onClose();
      setForm({
        nombre: "", 
        apellido: "", 
        email: "", 
        password: "", 
        telefono: "", 
        direccion: "", 
        dni: "", 
        genero: "Masculino"
      });
    } else {
      alert("Fallo al registrar");
    }
  };

  const handleSwitchToLogin = () => {
    setForm({
      nombre: "", 
      apellido: "", 
      email: "", 
      password: "", 
      telefono: "", 
      direccion: "", 
      dni: "", 
      genero: "Masculino"
    });
    onSwitchToLogin();
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
              className="fixed z-50 top-1/2 left-1/2 w-full max-w-md bg-white rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-center text-orange-500 flex-1">Registrarse</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Nombre" 
                  value={form.nombre} 
                  onChange={e => setForm({ ...form, nombre: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Apellido" 
                  value={form.apellido} 
                  onChange={e => setForm({ ...form, apellido: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Email" 
                  type="email"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required
                />
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Contraseña" 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Teléfono" 
                  value={form.telefono} 
                  onChange={e => setForm({ ...form, telefono: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Dirección" 
                  value={form.direccion} 
                  onChange={e => setForm({ ...form, direccion: e.target.value })} 
                  required
                />
                <input 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="DNI" 
                  value={form.dni} 
                  onChange={e => setForm({ ...form, dni: e.target.value })} 
                  required
                />
                <select 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  value={form.genero} 
                  onChange={e => setForm({ ...form, genero: e.target.value })}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                <button 
                  type="submit" 
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                  Registrarse
                </button>
              </form>
              <p className="mt-4 text-sm text-center text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button 
                  onClick={handleSwitchToLogin} 
                  className="text-orange-500 hover:underline font-medium"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Toast de éxito */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]"
          >
            ¡Registro exitoso!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
