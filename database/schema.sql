-- ============================================================
-- Cloud Inventory Pro
-- Schema de base de datos
-- ============================================================

-- Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS cloud_inventory_pro
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cloud_inventory_pro;

-- ============================================================
-- Tabla: categoria
-- Almacena los tipos de producto disponibles en la tienda
-- ============================================================
CREATE TABLE IF NOT EXISTS categoria (
    id      BIGINT          NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(100)    NOT NULL,

    CONSTRAINT pk_categoria PRIMARY KEY (id),
    CONSTRAINT uq_categoria_nombre UNIQUE (nombre)
);

-- ============================================================
-- Tabla: producto
-- Almacena los productos del inventario
-- ============================================================
CREATE TABLE IF NOT EXISTS producto (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(150)    NOT NULL,
    descripcion     VARCHAR(500),
    precio          DECIMAL(10, 2)  NOT NULL,
    stock           INT             NOT NULL DEFAULT 0,
    stock_minimo    INT             NOT NULL DEFAULT 5,
    categoria_id    BIGINT          NOT NULL,

    CONSTRAINT pk_producto          PRIMARY KEY (id),
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- Tabla: movimiento
-- Registra cada entrada o salida de producto del inventario
-- ============================================================
CREATE TABLE IF NOT EXISTS movimiento (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    tipo        ENUM('ENTRADA', 'SALIDA') NOT NULL,
    cantidad    INT         NOT NULL,
    fecha       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    producto_id BIGINT      NOT NULL,

    CONSTRAINT pk_movimiento        PRIMARY KEY (id),
    CONSTRAINT fk_movimiento_producto
        FOREIGN KEY (producto_id)
        REFERENCES producto(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- Datos iniciales (categorías base de la tienda)
-- ============================================================
INSERT INTO categoria (nombre) VALUES
    ('Computadoras'),
    ('Laptops'),
    ('Celulares'),
    ('Tablets'),
    ('Accesorios');