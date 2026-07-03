package com.cloudinventory.backend.movimiento;

import com.cloudinventory.backend.producto.Producto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla 'movimiento' en la base de datos.
 * Registra cada entrada o salida de producto del inventario.
 */
@Entity
@Table(name = "movimiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Solo permite los valores ENTRADA o SALIDA
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoMovimiento tipo;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // Asigna la fecha automáticamente antes de guardar
    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}