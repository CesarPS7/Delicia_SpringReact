import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo y descripción */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-orange-400 mr-2">Pastelería</span>
              <span className="text-2xl font-bold">Delicia</span>
            </div>
            <p className="text-gray-400 mb-4">
              Desde 2010, llevando alegría y sabor a cada hogar con nuestros productos horneados artesanales.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Explorar</h3>
            <ul className="space-y-3">
              {['Menú', 'Galería', 'Eventos', 'Regalos'].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Información de contacto */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0 text-orange-400" />
                <span>Jr. Parra del Riego 468 - El Tambo</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-orange-400" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-orange-400" />
                <span>delicia.pastry@gmail.com</span>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3 text-orange-400" />
                <span>Lun-Sab: 12pm - 9pm</span>
              </li>
            </ul>
          </motion.div>

          {/* Boletín informativo */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-white">Nuevos productos</h3>
            <p className="text-gray-400 mb-4">
              Suscríbete para recibir novedades.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white border-2 border-orange-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Enviar
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-800 my-8"
        ></motion.div>

        {/* Copyright */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-gray-500 text-sm"
        >
          <p>
            &copy; {new Date().getFullYear()} Pastelería Delicia. Todos los derechos reservados. | 
            <a href="#" className="hover:text-orange-400 ml-2">Políticas de Privacidad</a> | 
            <a href="#" className="hover:text-orange-400 ml-2">Términos de Servicio</a>
          </p>
          <p className="mt-2">
            Hecho con ❤️ por tu panadería de confianza
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;