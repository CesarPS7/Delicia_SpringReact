package com.panaderia.service;

import com.panaderia.delicia.security.JwtService;
import com.panaderia.model.Cliente;
import com.panaderia.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Map<String, Object> register(Cliente cliente) throws Exception {
        // Verificar si el email ya existe
        if (clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new Exception("El email ya está registrado");
        }

        // Encriptar contraseña
        cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
        
        // Guardar cliente
        Cliente clienteGuardado = clienteRepository.save(cliente);

        // Crear UserDetails para generar token
        UserDetails userDetails = User.builder()
                .username(clienteGuardado.getEmail())
                .password(clienteGuardado.getPassword())
                .authorities(new ArrayList<>())
                .build();

        // Generar token
        String token = jwtService.generateToken(userDetails);

        // Preparar respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("cliente", clienteGuardado);
        response.put("token", token);
        response.put("message", "Registro exitoso");

        return response;
    }

    public Map<String, Object> login(String email, String password) throws Exception {
        // Autenticar
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        // Buscar cliente
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        // Crear UserDetails
        UserDetails userDetails = User.builder()
                .username(cliente.getEmail())
                .password(cliente.getPassword())
                .authorities(new ArrayList<>())
                .build();

        // Generar token
        String token = jwtService.generateToken(userDetails);

        // Preparar respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("cliente", cliente);
        response.put("token", token);
        response.put("message", "Login exitoso");

        return response;
    }

    public Map<String, Object> getProfile(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Token inválido");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        Map<String, Object> response = new HashMap<>();
        response.put("cliente", cliente);
        return response;
    }
}