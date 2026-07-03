package com.cloudinventory.backend.producto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cloudinventory.backend.categoria.Categoria;
import com.cloudinventory.backend.categoria.CategoriaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio con la lógica de negocio para Producto.
 */
@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    // Convertir entidad a DTO de respuesta
    private ProductoResponse toResponse(Producto producto) {
        boolean stockBajo = producto.getStock() <= producto.getStockMinimo();
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getStockMinimo(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre(),
                stockBajo
        );
    }

    // Obtener todos los productos
    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Obtener un producto por ID
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        return toResponse(producto);
    }

    // Obtener productos por categoría
    public List<ProductoResponse> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Obtener productos con stock bajo
    public List<ProductoResponse> listarStockBajo() {
        return productoRepository.findProductosConStockBajo()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Crear un nuevo producto
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + request.getCategoriaId()));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setCategoria(categoria);

        return toResponse(productoRepository.save(producto));
    }

    // Actualizar un producto existente
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + request.getCategoriaId()));

        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setCategoria(categoria);

        return toResponse(productoRepository.save(producto));
    }

    // Eliminar un producto
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }
}