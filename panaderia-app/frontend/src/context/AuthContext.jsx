import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cliente"));
    if (data) setCliente(data);
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("cliente", JSON.stringify(data));
      setCliente(data);
      return true;
    }
    return false;
  };

  const register = async (formData) => {
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("cliente", JSON.stringify(data));
      setCliente(data);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("cliente");
    setCliente(null);
  };

  return (
    <AuthContext.Provider value={{ cliente, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
