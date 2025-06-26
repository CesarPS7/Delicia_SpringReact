package com.panaderia.repository;

import com.panaderia.model.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuponRepository extends JpaRepository<Cupon, Integer> {
    Cupon findByCodigoAndActivoTrue(String codigo);
}
