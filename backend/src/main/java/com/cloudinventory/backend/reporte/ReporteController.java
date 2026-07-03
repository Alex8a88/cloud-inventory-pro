package com.cloudinventory.backend.reporte;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para reportes del inventario.
 * Base URL: /api/reportes
 */
@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    // GET /api/reportes/inventario
    @GetMapping("/inventario")
    public ResponseEntity<ReporteInventarioResponse> reporteInventario() {
        return ResponseEntity.ok(reporteService.obtenerReporteInventario());
    }

    // GET /api/reportes/movimientos
    @GetMapping("/movimientos")
    public ResponseEntity<ReporteMovimientoResponse> reporteMovimientos() {
        return ResponseEntity.ok(reporteService.obtenerReporteMovimientos());
    }

    // GET /api/reportes/productos-mas-movidos
    @GetMapping("/productos-mas-movidos")
    public ResponseEntity<List<ProductoMovidoResponse>> productosMasMovidos() {
        return ResponseEntity.ok(reporteService.obtenerProductosMasMovidos());
    }
}