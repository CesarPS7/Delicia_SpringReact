package com.panaderia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "detalle_venta")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private int cantidad;

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;

    private BigDecimal subtotal;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private BigDecimal cuponDescuento;

    private String codigoDescuento;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}
