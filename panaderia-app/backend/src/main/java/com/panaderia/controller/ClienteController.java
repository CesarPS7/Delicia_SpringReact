package com.panaderia.controller;

import com.panaderia.model.Cliente;
import com.panaderia.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente cliente) {
        try {
            if (cliente.getFechaRegistro() == null) {
                cliente.setFechaRegistro(LocalDateTime.now());
            }

            Cliente registrado = clienteRepository.save(cliente);
            return ResponseEntity.ok(registrado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al registrar cliente");
        }
    }

    // ✅ NUEVO GET
    @GetMapping
    public ResponseEntity<List<Cliente>> obtenerClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        return ResponseEntity.ok(clientes);
    }
}
