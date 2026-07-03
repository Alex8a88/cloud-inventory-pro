package com.cloudinventory.backend.producto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de acceso a datos para Producto.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos por categoría
    List<Producto> findByCategoriaId(Long categoriaId);

    // Buscar productos con stock bajo (stock <= stockMinimo)
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();
}