package com.cloudinventory.backend.reporte;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para el reporte de movimientos.
 */
@Getter
@Setter
@AllArgsConstructor
public class ReporteMovimientoResponse {

    private long totalMovimientos;
    private long totalEntradas;
    private long totalSalidas;
    private int unidadesIngresadas;
    private int unidadesEgresadas;
}