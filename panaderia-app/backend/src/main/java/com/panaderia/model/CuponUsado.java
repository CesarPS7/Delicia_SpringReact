package com.panaderia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class CuponUsado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Cupon cupon;

    private LocalDateTime fechaUso;
}
