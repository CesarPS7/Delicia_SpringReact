package com.panaderia.service.impl;

import com.panaderia.model.Empleado;
import com.panaderia.repository.EmpleadoRepository;
import com.panaderia.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoServiceImpl implements EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Override
    public List<Empleado> findAll() {
        return empleadoRepository.findAll();
    }

    @Override
    public Empleado findById(Integer id) { // Cambiar Long por Integer
        return empleadoRepository.findById(id).orElse(null);
    }

    @Override
    public Empleado save(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    @Override
    public void deleteById(Integer id) { // Cambiar Long por Integer
        empleadoRepository.deleteById(id);
    }
}