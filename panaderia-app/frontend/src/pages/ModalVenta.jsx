import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import qrImage from '../assets/qr.jpg';
import { useCart } from '../context/CartContext';

const ModalVenta = ({ isOpen, onClose, cliente, carrito, total }) => {
  const { clearCart, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

  const [tipoPago, setTipoPago] = useState('');
  const [formaEntrega, setFormaEntrega] = useState('');
  const [cupon, setCupon] = useState('');
  const [direccionAlterna, setDireccionAlterna] = useState('');
  const [usaDireccionRegistro, setUsaDireccionRegistro] = useState(null);
  const [datosTarjeta, setDatosTarjeta] = useState({ 
    nombre: '', 
    numero: '', 
    cvc: '', 
    fecha: '' 
  });
  const [empleadoId, setEmpleadoId] = useState(null);
  
  // Estados para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // 'success', 'error', 'warning'
  });

  // Estado para editar productos
  const [editingProducts, setEditingProducts] = useState(false);
  const [localCarrito, setLocalCarrito] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      obtenerEmpleadoDisponible();
      setLocalCarrito([...carrito]); // Copia local del carrito
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen, carrito]);

  const obtenerEmpleadoDisponible = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/empleados');
      if (res.ok) {
        const empleados = await res.json();
        if (empleados.length > 0) {
          setEmpleadoId(empleados[0].id);
        }
      }
    } catch (err) {
      console.error('Error al obtener empleados:', err);
      setEmpleadoId(1);
    }
  };

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Funciones para editar productos
  const updateLocalQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeLocalProduct(productId);
      return;
    }
    setLocalCarrito(prev => 
      prev.map(item => 
        (item.id || item.productoId) === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeLocalProduct = (productId) => {
    setLocalCarrito(prev => 
      prev.filter(item => (item.id || item.productoId) !== productId)
    );
  };

  const saveProductChanges = () => {
    // Aquí puedes actualizar el carrito global si es necesario
    localCarrito.forEach(item => {
      const originalItem = carrito.find(orig => 
        (orig.id || orig.productoId) === (item.id || item.productoId)
      );
      if (originalItem && originalItem.quantity !== item.quantity) {
        updateQuantity(item.id || item.productoId, item.quantity);
      }
    });
    
    // Remover productos eliminados
    carrito.forEach(item => {
      const exists = localCarrito.find(local => 
        (local.id || local.productoId) === (item.id || item.productoId)
      );
      if (!exists) {
        removeFromCart(item.id || item.productoId);
      }
    });

    setEditingProducts(false);
    showNotification('Productos actualizados correctamente', 'success');
  };

  const cancelProductChanges = () => {
    setLocalCarrito([...carrito]);
    setEditingProducts(false);
  };

  // Calcular total local
  const calculateLocalTotal = () => {
    return localCarrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (!isOpen) return null;

  const validarFormulario = () => {
    if (!tipoPago) {
      showNotification('Por favor seleccione un tipo de pago', 'error');
      return false;
    }
    if (!formaEntrega) {
      showNotification('Por favor seleccione una forma de entrega', 'error');
      return false;
    }
    if (formaEntrega === 'delivery' && usaDireccionRegistro === null) {
      showNotification('Por favor confirme la dirección de entrega', 'error');
      return false;
    }
    if (formaEntrega === 'delivery' && !usaDireccionRegistro && !direccionAlterna.trim()) {
      showNotification('Por favor ingrese una dirección alterna', 'error');
      return false;
    }
    if (tipoPago === 'tarjeta' && (!datosTarjeta.nombre || !datosTarjeta.numero || !datosTarjeta.cvc || !datosTarjeta.fecha)) {
      showNotification('Por favor complete todos los datos de la tarjeta', 'error');
      return false;
    }
    return true;
  };

  const handleConfirmarVenta = async () => {
    if (!validarFormulario()) return;

    const tiposPagoValidos = ['efectivo', 'tarjeta', 'yape', 'plin'];
    const formasEntregaValidas = ['local', 'delivery'];

    if (!tiposPagoValidos.includes(tipoPago)) {
      showNotification('Tipo de pago no válido', 'error');
      return;
    }
    if (!formasEntregaValidas.includes(formaEntrega)) {
      showNotification('Forma de entrega no válida', 'error');
      return;
    }
    if (!empleadoId) {
      showNotification('Error: No se pudo obtener información del empleado', 'error');
      return;
    }
    if (!localCarrito || localCarrito.length === 0) {
      showNotification('El carrito está vacío', 'error');
      return;
    }

    const productosInvalidos = localCarrito.filter(item => !item.id && !item.productoId);
    if (productosInvalidos.length > 0) {
      showNotification('Error: Algunos productos no tienen ID válido', 'error');
      console.error('Productos sin ID:', productosInvalidos);
      return;
    }

    const totalActual = calculateLocalTotal();
    const subtotalSinIgv = parseFloat((totalActual / 1.18).toFixed(2));
    const igv = parseFloat((totalActual - subtotalSinIgv).toFixed(2));

    let observaciones = '';
    if (formaEntrega === 'delivery') {
      observaciones = usaDireccionRegistro
        ? `Entrega a dirección registrada: ${cliente.direccion || 'No registrada'}`
        : `Entrega a dirección alterna: ${direccionAlterna}`;
    }

    const fechaLocal = new Date().toISOString().slice(0, 19);

    const venta = {
      clienteId: parseInt(cliente.clienteId || cliente.id || 1),
      empleadoId: parseInt(empleadoId),
      fecha: fechaLocal,
      total: parseFloat(totalActual.toFixed(2)),
      igv: igv,
      tipoPago: tipoPago.toLowerCase().trim(),
      formaEntrega: formaEntrega.toLowerCase().trim(),
      estado: 'Pagado',
      cuponDescuento: cupon ? 2.00 : 0.00,
      codigoCupon: cupon || '',
      observaciones: observaciones,
      detalles: localCarrito.map(item => ({
        productoId: parseInt(item.id || item.productoId),
        cantidad: item.quantity,
        precioUnitario: parseFloat(item.price.toFixed(2)),
        subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
        descripcion: item.name || '',
        cuponDescuento: cupon ? 2.00 : 0.00,
        codigoDescuento: cupon || '',
        observaciones: ''
      }))
    };

    try {
        const token = localStorage.getItem("token");

        const res = await fetch('http://localhost:8080/api/ventas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(venta)
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      generarPDF(data.numeroComprobante || 'TEMP-' + Date.now(), cupon ? 2.00 : 0.00);

      showNotification('¡Venta registrada exitosamente!', 'success');
      
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error completo:', error);
      showNotification(`Error al registrar la venta: ${error.message}`, 'error');
    }
  };

  const generarPDF = (numeroComprobante, cuponDescuento = 0) => {
    const doc = new jsPDF();
    doc.setFontSize(16).text('BOLETA DE VENTA', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente.nombre}`, 20, 40);
    doc.text(`Comprobante: ${numeroComprobante}`, 20, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Forma de entrega: ${formaEntrega}`, 20, 70);
    doc.text(`Tipo de pago: ${tipoPago}`, 20, 80);
    const direccionTexto = formaEntrega === 'delivery'
      ? (usaDireccionRegistro ? cliente.direccion : direccionAlterna)
      : 'N/A';
    doc.text(`Dirección: ${direccionTexto}`, 20, 90);

    doc.line(20, 100, 190, 100);
    doc.setFontSize(10);
    doc.text('PRODUCTO', 20, 110);
    doc.text('CANT.', 120, 110);
    doc.text('P. UNIT.', 140, 110);
    doc.text('SUBTOTAL', 170, 110);
    doc.line(20, 115, 190, 115);

    let yPosition = 125;
    localCarrito.forEach((item) => {
      doc.text(item.name.substring(0, 25), 20, yPosition);
      doc.text(item.quantity.toString(), 120, yPosition);
      doc.text(`S/ ${item.price.toFixed(2)}`, 140, yPosition);
      doc.text(`S/ ${(item.price * item.quantity).toFixed(2)}`, 170, yPosition);
      yPosition += 10;
    });

    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    const totalActual = calculateLocalTotal();
    const totalConDescuento = totalActual - cuponDescuento;
    const subtotalSinIgv = totalConDescuento / 1.18;
    const igvCalculado = totalConDescuento - subtotalSinIgv;

    doc.setFontSize(12);
    if (cuponDescuento > 0) {
      doc.text(`Descuento aplicado: -S/ ${cuponDescuento.toFixed(2)}`, 120, yPosition);
      yPosition += 10;
    }

    doc.text(`Subtotal: S/ ${subtotalSinIgv.toFixed(2)}`, 120, yPosition);
    doc.text(`IGV (18%): S/ ${igvCalculado.toFixed(2)}`, 120, yPosition + 10);
    doc.text(`TOTAL: S/ ${totalConDescuento.toFixed(2)}`, 120, yPosition + 25);

    doc.save(`boleta-${numeroComprobante}.pdf`);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <>
      {/* Notificaciones */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${getNotificationColor(notification.type)} text-white px-6 py-3 rounded-lg shadow-lg z-[9999]`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex justify-center items-center">
        {/* Fondo oscuro translúcido con blur */}
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Contenedor modal */}
        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl z-50">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-2">Confirmar Compra</h2>
          <p className="text-gray-600 mb-6">Bienvenido, <span className="font-semibold text-indigo-600">{cliente.nombre}</span></p>

          {/* Resumen con opción de editar */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Productos</h3>
              <button
                onClick={() => setEditingProducts(!editingProducts)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {editingProducts ? 'Cancelar' : 'Editar productos'}
              </button>
            </div>

            {editingProducts ? (
              <div className="space-y-3">
                {localCarrito.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      <p className="text-xs text-gray-500">S/ {item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateLocalQuantity(item.id || item.productoId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateLocalQuantity(item.id || item.productoId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeLocalProduct(item.id || item.productoId)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-sm font-medium">S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-3">
                  <button
                    onClick={saveProductChanges}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={cancelProductChanges}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              localCarrito.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-sm text-gray-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          {/* Pago y entrega */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de Pago</label>
              <select
                value={tipoPago}
                onChange={(e) => setTipoPago(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Seleccione</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Forma de Entrega</label>
              <select
                value={formaEntrega}
                onChange={(e) => {
                  setFormaEntrega(e.target.value);
                  setUsaDireccionRegistro(null);
                  setDireccionAlterna('');
                }}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Seleccione</option>
                <option value="local">Recojo en local</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>

          {/* Dirección delivery */}
          {formaEntrega === 'delivery' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿La entrega es para el lugar de su registro?
              </label>
              <div className="flex gap-4 mb-2">
                <button
                  className={`px-4 py-2 rounded ${usaDireccionRegistro === true ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => {
                    setUsaDireccionRegistro(true);
                    setDireccionAlterna('');
                  }}
                >
                  Sí
                </button>
                <button
                  className={`px-4 py-2 rounded ${usaDireccionRegistro === false ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setUsaDireccionRegistro(false)}
                >
                  No
                </button>
              </div>

              {usaDireccionRegistro === false && (
                <div>
                  <label className="text-sm text-gray-700">Dirección Alterna</label>
                  <input
                    type="text"
                    value={direccionAlterna}
                    onChange={(e) => setDireccionAlterna(e.target.value)}
                    placeholder="Ingrese dirección de entrega"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          {/* Métodos de pago dinámicos */}
          {tipoPago === 'efectivo' && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-blue-700">Puede pagar al repartidor o en tienda.</p>
            </div>
          )}

          {(tipoPago === 'yape' || tipoPago === 'plin') && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex flex-col items-center">
                <img
                  src={qrImage}
                  alt="QR"
                  className="w-40 h-40 object-contain mb-3 border-2 border-white rounded-lg shadow-sm"
                />
                <p className="text-center text-indigo-700 font-medium">
                  Número: 987654321<br />
                  <span className="text-sm text-indigo-600">Mostrar captura al entregar</span>
                </p>
              </div>
            </div>
          )}

          {tipoPago === 'tarjeta' && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-3 py-2 border rounded-md"
                    value={datosTarjeta.numero}
                    onChange={(e) => {
                      // Formatear número de tarjeta con espacios
                      let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setDatosTarjeta({ ...datosTarjeta, numero: value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre del Titular</label>
                  <input
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 border rounded-md"
                    value={datosTarjeta.nombre}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombre: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVC</label>
                    <input
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-3 py-2 border rounded-md"
                      value={datosTarjeta.cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setDatosTarjeta({ ...datosTarjeta, cvc: value });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha Exp.</label>
                    <input
                      type="month"
                      className="w-full px-3 py-2 border rounded-md"
                      value={datosTarjeta.fecha}
                      onChange={(e) => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cupón */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1">Cupón de descuento (opcional)</label>
            <input
              type="text"
              placeholder="Ingrese código de cupón"
              value={cupon}
              onChange={(e) => setCupon(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Confirmar */}
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">S/ {calculateLocalTotal().toFixed(2)}</p>
            </div>
            <button
              onClick={handleConfirmarVenta}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Confirmar y generar boleta
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalVenta;