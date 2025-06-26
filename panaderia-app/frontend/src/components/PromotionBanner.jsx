import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const PromotionBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden mt-16 mb-16"
    >
      {/* Efecto de fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-amber-100 opacity-95"></div>
      
      {/* Patrón de puntos decorativos */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjk3MDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuNSI+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPgo8L3N2Zz4=')]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                TE LLEVARÁS S/. 2.00 de descuento
              </span>
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base text-gray-700 max-w-md"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3 }}
            >
              En tu primera compra usando el código: <span className="font-bold text-orange-600">BIENVENIDO20</span>
            </motion.p>
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap shadow-md"
          >
            Ver Promoción
            <FiArrowRight className="text-lg" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionBanner;