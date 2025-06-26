package com.panaderia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String codigo;

    private String descripcion;

    private Double descuento;

    private boolean activo;

    private LocalDateTime fechaCreacion;
}
