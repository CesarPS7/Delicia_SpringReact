package com.panaderia.repository;

import com.panaderia.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByCategoriaId(Integer categoriaId);
}
