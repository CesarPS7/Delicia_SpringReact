package com.panaderia.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "empleados")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String apellido;
    private String usuario;
    private String password;
    private String rol;
    private String email;
    private String telefono;
    private String direccion;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    private String estado;
    private String observaciones;
}
