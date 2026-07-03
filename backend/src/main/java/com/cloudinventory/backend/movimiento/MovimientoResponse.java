package com.cloudinventory.backend.movimiento;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para devolver datos de un movimiento al cliente.
 */
@Getter
@Setter
@AllArgsConstructor
public class MovimientoResponse {

    private Long id;
    private String tipo;
    private Integer cantidad;
    private LocalDateTime fecha;
    private Long productoId;
    private String productoNombre;
    private Integer stockActual;
}