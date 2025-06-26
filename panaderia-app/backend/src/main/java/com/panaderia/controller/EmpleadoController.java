package com.panaderia.controller;

import com.panaderia.model.Empleado;
import com.panaderia.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @GetMapping
    public List<Empleado> getAll() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public Empleado getById(@PathVariable Integer id) { // Integer aquí
        return empleadoService.findById(id);
    }

    @PostMapping
    public Empleado create(@RequestBody Empleado empleado) {
        return empleadoService.save(empleado);
    }

    @PutMapping("/{id}")
    public Empleado update(@PathVariable Integer id, @RequestBody Empleado empleado) {
        empleado.setId(id);
        return empleadoService.save(empleado);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        empleadoService.deleteById(id);
    }
}
