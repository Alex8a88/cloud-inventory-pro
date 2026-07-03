package com.cloudinventory.backend.movimiento;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de acceso a datos para Movimiento.
 */
@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    // Obtener todos los movimientos de un producto específico
    List<Movimiento> findByProductoIdOrderByFechaDesc(Long productoId);

    // Obtener los últimos movimientos ordenados por fecha
    List<Movimiento> findAllByOrderByFechaDesc();
}