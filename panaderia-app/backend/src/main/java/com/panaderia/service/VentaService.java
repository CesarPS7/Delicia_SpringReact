package com.panaderia.service;

import com.panaderia.model.Venta;
import java.util.List;

public interface VentaService {
    List<Venta> findAll();

    Venta findById(Integer id); // Cambiar Long por Integer

    Venta save(Venta venta);

    void deleteById(Integer id); // Cambiar Long por Integer
}