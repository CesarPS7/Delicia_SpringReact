package com.panaderia.repository;

import com.panaderia.model.Cliente;
import com.panaderia.model.Cupon;
import com.panaderia.model.CuponUsado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuponUsadoRepository extends JpaRepository<CuponUsado, Integer> {
    boolean existsByClienteAndCupon(Cliente cliente, Cupon cupon);
}
