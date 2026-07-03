package com.cloudinventory.backend.alerta;

import com.cloudinventory.backend.producto.Producto;
import com.cloudinventory.backend.producto.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de alertas de stock bajo.
 */
@Service
@RequiredArgsConstructor
public class AlertaService {

    private final ProductoRepository productoRepository;

    // Convierte un producto en alerta a su DTO
    private AlertaResponse toResponse(Producto producto) {
        int unidadesFaltantes = Math.max(0, producto.getStockMinimo() - producto.getStock());
        return new AlertaResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getCategoria().getNombre(),
                producto.getStock(),
                producto.getStockMinimo(),
                unidadesFaltantes,
                producto.getPrecio()
        );
    }

    // Obtener todos los productos con stock bajo o agotado
    public List<AlertaResponse> obtenerAlertas() {
        return productoRepository.findProductosConStockBajo()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Obtener resumen de alertas para el dashboard
    public ResumenAlertaResponse obtenerResumen() {
        List<Producto> todos = productoRepository.findAll();

        long totalProductos = todos.size();
        long productosStockBajo = todos.stream()
                .filter(p -> p.getStock() <= p.getStockMinimo() && p.getStock() > 0)
                .count();
        long productosAgotados = todos.stream()
                .filter(p -> p.getStock() == 0)
                .count();

        return new ResumenAlertaResponse(totalProductos, productosStockBajo, productosAgotados);
    }
}