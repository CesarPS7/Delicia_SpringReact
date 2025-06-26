package com.panaderia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permitir todos los orígenes temporalmente
        configuration.setAllowedMethods(Arrays.asList("*")); // Permitir todos los métodos
        configuration.setAllowedHeaders(Arrays.asList("*")); // Permitir todos los headers
        configuration.setAllowCredentials(false); // Cambiar a false cuando usamos "*"

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Deshabilitar CSRF
                .csrf(csrf -> csrf.disable())

                // Configurar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configurar autorización - PERMITIR TODO TEMPORALMENTE
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // ⚠️ PERMITIR TODO - SOLO PARA DEBUG
                )

                // Configurar sesión como stateless
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Deshabilitar headers de seguridad que pueden causar problemas
                .headers(headers -> headers
                        .frameOptions().disable()
                        .contentTypeOptions().disable())

                .build();
    }
}