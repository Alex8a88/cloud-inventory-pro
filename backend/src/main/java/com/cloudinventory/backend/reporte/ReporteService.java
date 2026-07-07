package com.cloudinventory.backend.reporte;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cloudinventory.backend.categoria.CategoriaRepository;
import com.cloudinventory.backend.movimiento.MovimientoRepository;
import com.cloudinventory.backend.movimiento.TipoMovimiento;
import com.cloudinventory.backend.producto.Producto;
import com.cloudinventory.backend.producto.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimientoRepository movimientoRepository;

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

        BigDecimal valorTotal = productos.stream()
                .map(p -> p.getPrecio().multiply(BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ReporteInventarioResponse(
                totalProductos, totalCategorias,
                productosStockBajo, productosAgotados, valorTotal);
    }

    public ReporteMovimientoResponse obtenerReporteMovimientos() {
        var movimientos = movimientoRepository.findAll();

        long totalMovimientos = movimientos.size();
        long totalEntradas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.ENTRADA).count();
        long totalSalidas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.SALIDA).count();
        int unidadesIngresadas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.ENTRADA)
                .mapToInt(m -> m.getCantidad()).sum();
        int unidadesEgresadas = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.SALIDA)
                .mapToInt(m -> m.getCantidad()).sum();

        return new ReporteMovimientoResponse(
                totalMovimientos, totalEntradas, totalSalidas,
                unidadesIngresadas, unidadesEgresadas);
    }

    public List<ProductoMovidoResponse> obtenerProductosMasMovidos() {
        var movimientos = movimientoRepository.findAll();

        var conteoPorProducto = movimientos.stream()
                .collect(Collectors.groupingBy(
                        m -> m.getProducto().getId(),
                        Collectors.counting()
                ));

        return conteoPorProducto.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .map(entry -> {
                    Producto p = productoRepository.findById(entry.getKey()).orElseThrow();
                    return new ProductoMovidoResponse(
                            p.getId(),
                            p.getNombre(),
                            p.getCategoria().getNombre(),
                            entry.getValue()
                    );
                })
                .collect(Collectors.toList());
    }
}