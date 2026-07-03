package com.cloudinventory.backend.reporte;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para el reporte de productos más movidos.
 */
@Getter
@Setter
@AllArgsConstructor
public class ProductoMovidoResponse {

    private Long productoId;
    private String productoNombre;
    private String categoriaNombre;
    private long totalMovimientos;
}