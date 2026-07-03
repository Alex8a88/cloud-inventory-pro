package com.cloudinventory.backend.movimiento;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudinventory.backend.producto.Producto;
import com.cloudinventory.backend.producto.ProductoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio con la lógica de negocio para Movimientos.
 * Al registrar un movimiento actualiza el stock del producto.
 */
@Service
@RequiredArgsConstructor
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final ProductoRepository productoRepository;

    // Convierte entidad a DTO de respuesta
    private MovimientoResponse toResponse(Movimiento movimiento) {
        return new MovimientoResponse(
                movimiento.getId(),
                movimiento.getTipo().name(),
                movimiento.getCantidad(),
                movimiento.getFecha(),
                movimiento.getProducto().getId(),
                movimiento.getProducto().getNombre(),
                movimiento.getProducto().getStock()
        );
    }

    // Listar todos los movimientos
    public List<MovimientoResponse> listarTodos() {
        return movimientoRepository.findAllByOrderByFechaDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Listar movimientos de un producto específico
    public List<MovimientoResponse> listarPorProducto(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaDesc(productoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Registrar un nuevo movimiento y actualizar el stock
    @Transactional
    public MovimientoResponse registrar(MovimientoRequest request) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + request.getProductoId()));

        // Validar que haya suficiente stock para una salida
        if (request.getTipo() == TipoMovimiento.SALIDA) {
            if (producto.getStock() < request.getCantidad()) {
                throw new RuntimeException(
                    "Stock insuficiente. Stock actual: " + producto.getStock() +
                    ", cantidad solicitada: " + request.getCantidad()
                );
            }
            producto.setStock(producto.getStock() - request.getCantidad());
        }

        // Si es ENTRADA, sumar al stock
        if (request.getTipo() == TipoMovimiento.ENTRADA) {
            producto.setStock(producto.getStock() + request.getCantidad());
        }

        // Guardar el producto con el stock actualizado
        productoRepository.save(producto);

        // Registrar el movimiento
        Movimiento movimiento = new Movimiento();
        movimiento.setTipo(request.getTipo());
        movimiento.setCantidad(request.getCantidad());
        movimiento.setProducto(producto);

        return toResponse(movimientoRepository.save(movimiento));
    }
}