package com.panaderia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ventas")
public class Venta {

    // Enums deben coincidir exactamente con lo que espera el frontend
    public enum TipoPago {
        efectivo, tarjeta, yape, plin // <- minúsculas exactas
    }

    public enum FormaEntrega {
        local, delivery // <- minúsculas exactas
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private LocalDateTime fecha;
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private TipoPago tipoPago; // Se almacenará como string con el valor del enum

    private String numeroComprobante;
    private BigDecimal igv;
    private BigDecimal cuponDescuento;
    private String estado;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @Enumerated(EnumType.STRING)
    private FormaEntrega formaEntrega;
}