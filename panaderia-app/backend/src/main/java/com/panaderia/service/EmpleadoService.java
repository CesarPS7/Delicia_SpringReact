package com.panaderia.service;

import com.panaderia.model.Empleado;
import java.util.List;

public interface EmpleadoService {
    List<Empleado> findAll();

    Empleado findById(Integer id); // Cambiar Long por Integer

    Empleado save(Empleado empleado);

    void deleteById(Integer id); // Cambiar Long por Integer
}
