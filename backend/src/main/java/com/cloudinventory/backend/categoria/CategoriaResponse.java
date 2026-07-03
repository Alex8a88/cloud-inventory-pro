package com.cloudinventory.backend.categoria;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para devolver datos de una categoría al cliente.
 */
@Getter
@Setter
@AllArgsConstructor
public class CategoriaResponse {

    private Long id;
    private String nombre;
}