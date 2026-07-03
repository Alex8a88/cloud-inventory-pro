package com.cloudinventory.backend.categoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de acceso a datos para Categoria.
 * JpaRepository nos da CRUD completo sin escribir SQL.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Verifica si ya existe una categoría con ese nombre (para evitar duplicados)
    boolean existsByNombreIgnoreCase(String nombre);
}