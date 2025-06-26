package com.panaderia.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaRequestDTO {

    private Integer clienteId;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String tipoPago; // efectivo, tarjeta, yape, plin
    private BigDecimal igv;
    private BigDecimal cuponDescuento; // descuento aplicado (ej. 2.00)
    private String codigoCupon; // código del cupón (ej. "BIENVENIDO20")
    private String estado; // Pagado, Pendiente, etc.
    private String observaciones;
    private Integer empleadoId;
    private String formaEntrega; // local, delivery
    private List<DetalleDTO> detalles;

    @Data
    public static class DetalleDTO {
        private Integer productoId;
        private int cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
        private String descripcion;
        private BigDecimal cuponDescuento; // si aplica descuento por producto
        private String codigoDescuento; // opcional si el producto tiene código descuento
        private String observaciones;
    }
}
