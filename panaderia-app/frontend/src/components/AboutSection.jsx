import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { forwardRef } from "react";

const AboutSection = forwardRef((props, ref) => {
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 rounded-2xl mx-4 lg:mx-auto max-w-7xl my-16 sm:my-24"
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://mae-innovation.com/wp-content/uploads/2023/03/pexels-igor-ovsyannykov-205961.jpg"
          alt="Panadería artesanal"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Nuestra Historia
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Desde 2010, hemos estado horneando con pasión y dedicación, usando ingredientes locales y técnicas tradicionales para crear productos que deleitan a toda la familia.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 flex items-center gap-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Conoce más
              <FiArrowRight className="text-lg" />
            </motion.button>

            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white hover:text-orange-300 transition-colors"
            >
              Ver nuestro equipo <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decoración */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 opacity-10 blur-3xl" />
    </motion.section>
  );
});

export default AboutSection;
