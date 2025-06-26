package com.panaderia.service.impl;

import com.panaderia.model.DetalleVenta;
import com.panaderia.repository.DetalleVentaRepository;
import com.panaderia.service.DetalleVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentaServiceImpl implements DetalleVentaService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Override
    public List<DetalleVenta> findAll() {
        return detalleVentaRepository.findAll();
    }

    @Override
    public DetalleVenta findById(Integer id) { // Cambiar Long por Integer
        return detalleVentaRepository.findById(id).orElse(null);
    }

    @Override
    public DetalleVenta save(DetalleVenta detalleVenta) {
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public void deleteById(Integer id) { // Cambiar Long por Integer
        detalleVentaRepository.deleteById(id);
    }
}
