package com.cloudinventory.backend.alerta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO con el resumen de alertas para el dashboard.
 */
@Getter
@Setter
@AllArgsConstructor
public class ResumenAlertaResponse {

    private long totalProductos;
    private long productosStockBajo;
    private long productosAgotados;
}