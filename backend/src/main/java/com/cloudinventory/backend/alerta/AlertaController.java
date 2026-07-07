package com.cloudinventory.backend.alerta;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para alertas de inventario.
 * Base URL: /api/alertas
 */
@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;

    // GET /api/alertas — Lista productos con stock bajo o agotado
    @GetMapping
    public ResponseEntity<List<AlertaResponse>> obtenerAlertas() {
        return ResponseEntity.ok(alertaService.obtenerAlertas());
    }

    // GET /api/alertas/resumen — Resumen para el dashboard
    @GetMapping("/resumen")
    public ResponseEntity<ResumenAlertaResponse> obtenerResumen() {
        return ResponseEntity.ok(alertaService.obtenerResumen());
    }
}