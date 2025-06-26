package com.panaderia.service;

import com.panaderia.model.Cliente;
import com.panaderia.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Cliente register(Cliente cliente) {
        cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
        return clienteRepository.save(cliente);
    }

    public Cliente login(String email, String password) throws Exception {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
        if (!passwordEncoder.matches(password, cliente.getPassword())) {
            throw new Exception("Contraseña incorrecta");
        }
        return cliente;
    }
}
