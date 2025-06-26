package com.panaderia.service.impl;

import com.panaderia.model.Venta;
import com.panaderia.repository.VentaRepository;
import com.panaderia.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Override
    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    @Override
    public Venta findById(Integer id) { // Cambiar Long por Integer
        return ventaRepository.findById(id).orElse(null);
    }

    @Override
    public Venta save(Venta venta) {
        return ventaRepository.save(venta);
    }

    @Override
    public void deleteById(Integer id) { // Cambiar Long por Integer
        ventaRepository.deleteById(id);
    }
}