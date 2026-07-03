package com.cloudinventory.backend.reporte;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para el reporte general de inventario.
 */
@Getter
@Setter
@AllArgsConstructor
public class ReporteInventarioResponse {

    private long totalProductos;
    private long totalCategorias;
    private long productosStockBajo;
    private long productosAgotados;
    private BigDecimal valorTotalInventario;
}