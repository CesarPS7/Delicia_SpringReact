package com.panaderia.service;

import com.panaderia.model.DetalleVenta;
import java.util.List;

public interface DetalleVentaService {
    List<DetalleVenta> findAll();

    DetalleVenta findById(Integer id); // Cambiar Long por Integer

    DetalleVenta save(DetalleVenta detalleVenta);

    void deleteById(Integer id); // Cambiar Long por Integer
}