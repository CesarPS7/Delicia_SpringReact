package com.panaderia.controller;

import com.panaderia.model.Producto;
import com.panaderia.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // permite peticiones desde el frontend
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // ✅ GET: listar productos
    @GetMapping
    public List<Producto> getAll(@RequestParam(required = false) Integer categoria) {
        if (categoria != null) {
            return productoRepository.findByCategoriaId(categoria);
        }
        return productoRepository.findAll();
    }

    // ✅ POST: crear producto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoRepository.save(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }
}
