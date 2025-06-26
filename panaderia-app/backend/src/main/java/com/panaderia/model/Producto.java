package com.panaderia.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "producto")
@Data // <- ESTA ANOTACIÓN AGREGA TODOS LOS GETTERS/SETTERS AUTOMÁTICAMENTE
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Double precio;

    @Column(name = "categoria_id")
    private Integer categoriaId;

    private Integer stock;

    @Column(name = "imagen_url")
    private String imagenUrl;

    private Double peso;

    @Column(name = "tiempo_preparacion")
    private String tiempoPreparacion;

    private String estado;

    @Column(name = "codigo_producto")
    private String codigoProducto;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
