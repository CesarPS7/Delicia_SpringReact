import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay datos guardados al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedCliente = localStorage.getItem("cliente");
    
    if (savedToken && savedCliente) {
      setToken(savedToken);
      setCliente(JSON.parse(savedCliente));
    }
    setLoading(false);
  }, []);

  // Función para hacer requests autenticados
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar token y cliente
        localStorage.setItem("token", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));
        
        setToken(data.token);
        setCliente(data.cliente);
        
        console.log("Login exitoso:", data.message);
        return true;
      } else {
        const error = await response.json();
        console.error("Error de login:", error.error);
        return false;
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar token y cliente
        localStorage.setItem("token", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));
        
        setToken(data.token);
        setCliente(data.cliente);
        
        console.log("Registro exitoso:", data.message);
        return true;
      } else {
        const error = await response.json();
        console.error("Error de registro:", error.error);
        return false;
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cliente");
    setToken(null);
    setCliente(null);
  };

  // Función para obtener el perfil del usuario
  const getProfile = async () => {
    try {
      const response = await authenticatedFetch("http://localhost:8080/auth/profile");
      
      if (response.ok) {
        const data = await response.json();
        setCliente(data.cliente);
        return data.cliente;
      } else {
        // Token inválido, cerrar sesión
        logout();
        return null;
      }
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return null;
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return token !== null && cliente !== null;
  };

  const value = {
    cliente,
    token,
    login,
    register,
    logout,
    getProfile,
    isAuthenticated,
    authenticatedFetch,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

// Componente HOC para proteger rutas
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated()) {
    return <div>Debes iniciar sesión para acceder a esta página</div>;
  }

  return children;
};

// Hook personalizado para datos protegidos
export const useProtectedData = (url) => {
  const { authenticatedFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(url);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError("Error al cargar datos");
        }
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, authenticatedFetch]);

  return { data, loading, error };
};