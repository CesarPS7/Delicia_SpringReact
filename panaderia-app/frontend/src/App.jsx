import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/RegisterModal";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
