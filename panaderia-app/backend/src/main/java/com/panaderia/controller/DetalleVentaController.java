package com.panaderia.controller;

import com.panaderia.model.DetalleVenta;
import com.panaderia.service.DetalleVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-ventas")
@CrossOrigin(origins = "*")
public class DetalleVentaController {

    @Autowired
    private DetalleVentaService detalleVentaService;

    @GetMapping
    public List<DetalleVenta> getAll() {
        return detalleVentaService.findAll();
    }

    @GetMapping("/{id}")
    public DetalleVenta getById(@PathVariable Integer id) { // Integer aquí
        return detalleVentaService.findById(id);
    }

    @PostMapping
    public DetalleVenta create(@RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.save(detalleVenta);
    }

    @PutMapping("/{id}")
    public DetalleVenta update(@PathVariable Integer id, @RequestBody DetalleVenta detalleVenta) {
        detalleVenta.setId(id);
        return detalleVentaService.save(detalleVenta);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        detalleVentaService.deleteById(id);
    }
}
