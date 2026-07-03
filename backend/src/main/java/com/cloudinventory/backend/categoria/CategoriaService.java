package com.cloudinventory.backend.categoria;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * Servicio que contiene la lógica de negocio para Categoria.
 */
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    // Obtener todas las categorías
    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(c -> new CategoriaResponse(c.getId(), c.getNombre()))
                .collect(Collectors.toList());
    }

    // Obtener una categoría por ID
    public CategoriaResponse obtenerPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));
        return new CategoriaResponse(categoria.getId(), categoria.getNombre());
    }

    // Crear una nueva categoría
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + request.getNombre());
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre().trim());

        Categoria guardada = categoriaRepository.save(categoria);
        return new CategoriaResponse(guardada.getId(), guardada.getNombre());
    }

    // Actualizar una categoría existente
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        if (categoriaRepository.existsByNombreIgnoreCase(request.getNombre())
                && !categoria.getNombre().equalsIgnoreCase(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + request.getNombre());
        }

        categoria.setNombre(request.getNombre().trim());
        Categoria actualizada = categoriaRepository.save(categoria);
        return new CategoriaResponse(actualizada.getId(), actualizada.getNombre());
    }

    // Eliminar una categoría
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}