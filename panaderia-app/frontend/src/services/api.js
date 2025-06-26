// Rutas públicas (no requieren autenticación)

export const getProductos = async () => {
  const res = await fetch("http://localhost:8080/api/productos");
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

export const getCategorias = async () => {
  const res = await fetch("http://localhost:8080/api/categorias");
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
};

// Rutas privadas (requieren token JWT)

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado. El usuario no está autenticado.");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getEmpleados = async () => {
  const res = await fetch("http://localhost:8080/api/empleados", {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al obtener empleados");
  return res.json();
};

export const registrarVenta = async (ventaDTO) => {
  const res = await fetch("http://localhost:8080/api/ventas", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ventaDTO),
  });

  if (!res.ok) throw new Error("Error al registrar venta");
  return res.json();
};


