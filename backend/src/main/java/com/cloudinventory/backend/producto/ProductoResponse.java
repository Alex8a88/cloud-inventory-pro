package com.cloudinventory.backend.producto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para devolver datos de un producto al cliente.
 */
@Getter
@Setter
@AllArgsConstructor
public class ProductoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private Integer stockMinimo;
    private Long categoriaId;
    private String categoriaNombre;
    private boolean stockBajo;
}