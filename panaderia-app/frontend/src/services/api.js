export const getProductos = async () => {
  const res = await fetch("http://localhost:8080/api/productos");
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};