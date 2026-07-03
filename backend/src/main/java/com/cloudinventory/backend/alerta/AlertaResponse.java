package com.cloudinventory.backend.alerta;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO que representa una alerta de stock bajo.
 */
@Getter
@Setter
@AllArgsConstructor
public class AlertaResponse {

    private Long productoId;
    private String productoNombre;
    private String categoriaNombre;
    private Integer stockActual;
    private Integer stockMinimo;
    private Integer unidadesFaltantes;
    private BigDecimal precio;
}