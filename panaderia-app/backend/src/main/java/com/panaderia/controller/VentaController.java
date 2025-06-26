package com.panaderia.controller;

import com.panaderia.dto.VentaRequestDTO;
import com.panaderia.model.*;
import com.panaderia.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CuponRepository cuponRepository;

    @Autowired
    private CuponUsadoRepository cuponUsadoRepository;

    // ✅ GET: Listar todas las ventas
    @GetMapping
    public ResponseEntity<List<Venta>> getAllVentas() {
        List<Venta> ventas = ventaRepository.findAll();
        return ResponseEntity.ok(ventas);
    }

    // ✅ POST: Registrar venta
    @PostMapping
    public ResponseEntity<?> registrarVenta(@RequestBody VentaRequestDTO ventaDTO) {
        try {
            // Validación de enums
            try {
                Venta.TipoPago.valueOf(ventaDTO.getTipoPago().toLowerCase());
                Venta.FormaEntrega.valueOf(ventaDTO.getFormaEntrega().toLowerCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Valores de enum no válidos. "
                        + "TipoPago permitidos: " + Arrays.toString(Venta.TipoPago.values()) + ", "
                        + "FormaEntrega permitidos: " + Arrays.toString(Venta.FormaEntrega.values()));
            }

            // Validar cliente
            Cliente cliente = clienteRepository.findById(ventaDTO.getClienteId()).orElse(null);
            if (cliente == null) {
                return ResponseEntity.badRequest().body("Cliente no encontrado con ID: " + ventaDTO.getClienteId());
            }

            // Validar empleado
            Empleado empleado = empleadoRepository.findById(ventaDTO.getEmpleadoId()).orElse(null);
            if (empleado == null) {
                return ResponseEntity.badRequest().body("Empleado no encontrado con ID: " + ventaDTO.getEmpleadoId());
            }

            // Validar productos
            for (VentaRequestDTO.DetalleDTO detalle : ventaDTO.getDetalles()) {
                if (!productoRepository.existsById(detalle.getProductoId())) {
                    return ResponseEntity.badRequest()
                            .body("Producto no encontrado con ID: " + detalle.getProductoId());
                }
            }

            // Validar cupón (opcional)
            String codigoCupon = ventaDTO.getCodigoCupon();
            Cupon cupon = null;
            if (codigoCupon != null && !codigoCupon.trim().isEmpty()) {
                cupon = cuponRepository.findByCodigoAndActivoTrue(codigoCupon);
                if (cupon == null) {
                    return ResponseEntity.badRequest()
                            .body("El cupón '" + codigoCupon + "' no existe o no está activo");
                }
                boolean usado = cuponUsadoRepository.existsByClienteAndCupon(cliente, cupon);
                if (usado) {
                    return ResponseEntity.badRequest().body("Ya has usado este cupón anteriormente");
                }
            }

            // Generar número de comprobante
            String numeroComprobante = String.format("B001-%06d", ventaRepository.count() + 1);

            // Crear venta
            Venta venta = new Venta();
            venta.setCliente(cliente);
            venta.setEmpleado(empleado);
            venta.setFecha(ventaDTO.getFecha());
            venta.setTotal(ventaDTO.getTotal());
            venta.setTipoPago(Venta.TipoPago.valueOf(ventaDTO.getTipoPago().toLowerCase()));
            venta.setFormaEntrega(Venta.FormaEntrega.valueOf(ventaDTO.getFormaEntrega().toLowerCase()));
            venta.setNumeroComprobante(numeroComprobante);
            venta.setIgv(ventaDTO.getIgv());
            venta.setCuponDescuento(ventaDTO.getCuponDescuento());
            venta.setEstado(ventaDTO.getEstado());
            venta.setObservaciones(ventaDTO.getObservaciones());

            venta = ventaRepository.save(venta);

            // Guardar detalles
            for (VentaRequestDTO.DetalleDTO d : ventaDTO.getDetalles()) {
                Producto producto = productoRepository.findById(d.getProductoId()).orElse(null);
                if (producto == null) {
                    return ResponseEntity.badRequest().body("Producto con ID " + d.getProductoId() + " no encontrado");
                }

                DetalleVenta detalle = new DetalleVenta();
                detalle.setVenta(venta);
                detalle.setProducto(producto);
                detalle.setCantidad(d.getCantidad());
                detalle.setPrecioUnitario(d.getPrecioUnitario());
                detalle.setSubtotal(d.getSubtotal());
                detalle.setDescripcion(d.getDescripcion());
                detalle.setCuponDescuento(d.getCuponDescuento());
                detalle.setCodigoDescuento(d.getCodigoDescuento());
                detalle.setObservaciones(d.getObservaciones());

                detalleVentaRepository.save(detalle);
            }

            // Marcar cupón como usado
            if (cupon != null) {
                CuponUsado cuponUsado = new CuponUsado();
                cuponUsado.setCliente(cliente);
                cuponUsado.setCupon(cupon);
                cuponUsado.setFechaUso(LocalDateTime.now());
                cuponUsadoRepository.save(cuponUsado);
            }

            // Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Venta registrada con éxito");
            response.put("numeroComprobante", numeroComprobante);
            response.put("ventaId", venta.getId());
            response.put("total", venta.getTotal());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
