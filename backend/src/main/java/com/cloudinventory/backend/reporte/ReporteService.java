package com.cloudinventory.backend.reporte;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cloudinventory.backend.categoria.CategoriaRepository;
import com.cloudinventory.backend.movimiento.Movimiento;
import com.cloudinventory.backend.movimiento.MovimientoRepository;
import com.cloudinventory.backend.movimiento.TipoMovimiento;
import com.cloudinventory.backend.producto.Producto;
import com.cloudinventory.backend.producto.ProductoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para generación de reportes del inventario.
 */
@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimientoRepository movimientoRepository;

    // Reporte general del inventario
    public ReporteInventarioResponse obtenerReporteInventario() {
        List<Producto> productos = productoRepository.findAll();

        long totalProductos = productos.size();
        long totalCategorias = categoriaRepository.count();

        long productosStockBajo = productos.stream()
                .filter(p -> p.getStock() <= p.getStockMinimo() && p.getStock() > 0)
                .count();

        long productosAgotados = productos.stream()
                .filter(p -> p.getStock() == 0)
                .count();

        // Valor total = suma de (precio * stock) de cada producto
        BigDecimal valorTotal = productos.stream()
                .map(p -> p.getPrecio().multiply(BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ReporteInventarioResponse(
                totalProductos,
                totalCategorias,
                productosStockBajo,
                productosAgotados,
                valorTotal
        );
    }

    // Reporte de movimientos
    public ReporteMovimientoResponse obtenerReporteMovimientos() {
        List<Movimiento> movimientos = movimientoRepository.findAll();

        long totalMovimientos = movimientos.size();

        long totalEntradas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.ENTRADA)
                .count();

        long totalSalidas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.SALIDA)
                .count();

        int unidadesIngresadas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.ENTRADA)
                .mapToInt(Movimiento::getCantidad)
                .sum();

        int unidadesEgresadas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.SALIDA)
                .mapToInt(Movimiento::getCantidad)
                .sum();

        return new ReporteMovimientoResponse(
                totalMovimientos,
                totalEntradas,
                totalSalidas,
                unidadesIngresadas,
                unidadesEgresadas
        );
    }

    // Reporte de productos más movidos
    public List<ProductoMovidoResponse> obtenerProductosMasMovidos() {
        List<Movimiento> movimientos = movimientoRepository.findAll();

        // Agrupa movimientos por producto y cuenta cuántos tiene cada uno
        Map<Producto, Long> movimientosPorProducto = movimientos.stream()
                .collect(Collectors.groupingBy(Movimiento::getProducto, Collectors.counting()));

        return movimientosPorProducto.entrySet().stream()
                .sorted(Map.Entry.<Producto, Long>comparingByValue().reversed())
                .map(entry -> new ProductoMovidoResponse(
                        entry.getKey().getId(),
                        entry.getKey().getNombre(),
                        entry.getKey().getCategoria().getNombre(),
                        entry.getValue()
                ))
                .collect(Collectors.toList());
    }
}