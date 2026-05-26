-- =====================================================
-- CREACION DE TABLAS
-- =====================================================

-- Tabla de clientes
-- Almacena la informacion de los clientes de la licorera
CREATE TABLE cliente(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100) UNIQUE
);

-- Tabla de productos
-- Guarda los productos disponibles para la venta
CREATE TABLE producto(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('alcoholico','no alcoholico')),
    precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
    cantidad_stock INT NOT NULL CHECK (cantidad_stock >= 0),
    marca VARCHAR(100)
);

-- Tabla de proveedores
-- Registra proveedores de bebidas y productos
CREATE TABLE proveedor(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(50),
    correo VARCHAR(100)
);

-- Tabla de usuarios
-- Usuarios que usan el sistema
CREATE TABLE usuario(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(50) UNIQUE,
    contrasena VARCHAR(50),
    rol VARCHAR(20)
);

-- Tabla de ventas
-- Guarda informacion general de cada venta
CREATE TABLE venta(
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    metodo_pago VARCHAR(50),
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Tabla detalle_venta
-- Relaciona productos con ventas
CREATE TABLE detalle_venta(
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0),
    PRIMARY KEY (id_venta, id_producto),
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);

-- =====================================================
-- INSERCION DE DATOS
-- =====================================================

-- CLIENTES
-- Datos de prueba para clientes
INSERT INTO cliente (nombre, documento, telefono, correo) VALUES
('Juan Perez', '123456', '3001234567', 'juan@gmail.com'),
('Maria Lopez', '789012', '3009876543', 'maria@gmail.com'),
('Carlos Ruiz', '456789', '3015555555', 'carlos@gmail.com'),
('Laura Gomez', '112233', '3101112233', 'laura@gmail.com'),
('Andres Castro', '445566', '3114455667', 'andres@gmail.com'),
('Sofia Martinez', '778899', '3127788990', 'sofia@gmail.com'),
('Daniel Torres', '990011', '3139900112', 'daniel@gmail.com'),
('Valentina Rojas', '223344', '3142233445', 'valentina@gmail.com');



-- PRODUCTOS
-- Productos disponibles en la licorera
INSERT INTO producto (nombre, tipo, precio, cantidad_stock, marca) VALUES
('Cerveza Aguila', 'alcoholico', 3000, 100, 'Aguila'),
('Coca Cola', 'no alcoholico', 2500, 200, 'Coca Cola'),
('Ron Medellin', 'alcoholico', 45000, 50, 'Medellin'),
('Whisky Old Parr', 'alcoholico', 120000, 30, 'Old Parr'),
('Vino Gato Negro', 'alcoholico', 35000, 40, 'Gato Negro'),
('Pepsi', 'no alcoholico', 2800, 180, 'Pepsi'),
('Aguardiente Antioqueño', 'alcoholico', 40000, 70, 'Antioqueño'),
('Te Hatsu', 'no alcoholico', 5000, 90, 'Hatsu'),
('Vodka Smirnoff', 'alcoholico', 65000, 25, 'Smirnoff');



-- USUARIOS
-- Usuarios del sistema
INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES
('administrador', 'admin@licorera.com', '1234', 'administrador'),
('cajero1', 'cajero1@licorera.com', 'abcd', 'cajero'),
('cajero2', 'cajero2@licorera.com', 'efgh', 'cajero'),
('supervisor', 'supervisor@licorera.com', 'super123', 'supervisor'),
('empleado1', 'empleado1@licorera.com', 'emp123', 'cajero'),
('empleado2', 'empleado2@licorera.com', 'emp456', 'cajero');



-- PROVEEDORES
-- Proveedores registrados
INSERT INTO proveedor (nombre, telefono, direccion, correo) VALUES
('Distribuidora XYZ', '3011111111', 'Calle 10 #20-30', 'xyz@gmail.com'),
('Bebidas SAS', '3022222222', 'Carrera 15 #40-50', 'bebidas@gmail.com'),
('Licores Nacionales', '3201112233', 'Avenida 30 #45-60', 'licores@gmail.com'),
('Distribuciones Premium', '3212223344', 'Carrera 12 #18-22', 'premium@gmail.com'),
('Refrescos Colombia', '3223334455', 'Calle 80 #10-15', 'refrescos@gmail.com');



-- VENTAS
-- Ventas registradas en el sistema
INSERT INTO venta (fecha, total, metodo_pago, id_cliente, id_usuario) VALUES
('2026-04-08', 8500, 'Efectivo', 1, 2),
('2026-04-08', 120000, 'Tarjeta', 2, 1),
('2026-04-08', 48000, 'Efectivo', 3, 3),
('2026-05-01', 70000, 'Tarjeta', 4, 4),
('2026-05-02', 18400, 'Efectivo', 5, 5),
('2026-05-03', 130000, 'Transferencia', 6, 6),
('2026-05-03', 40000, 'Efectivo', 7, 4),
('2026-05-04', 7800, 'Nequi', 8, 5);



-- DETALLE VENTA
-- Productos vendidos en cada venta
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 3000),
(1, 2, 1, 2500),
(2, 4, 1, 120000),
(3, 3, 1, 45000),
(3, 1, 1, 3000),
(4, 5, 2, 35000),
(5, 6, 3, 2800),
(5, 8, 2, 5000),
(6, 9, 2, 65000),
(7, 7, 1, 40000),
(8, 6, 1, 2800),
(8, 2, 2, 2500);

-- =====================================================
-- VISTAS
-- =====================================================

-- Vista que muestra productos vendidos
-- junto con ingresos y cantidad vendida
CREATE VIEW reporte_productos_vendidos AS
SELECT 
    p.nombre AS producto,
    p.tipo,
    SUM(dv.cantidad) AS total_vendido,
    SUM(dv.cantidad * dv.precio_unitario) AS ingresos_totales,
    COUNT(*) AS veces_vendido
FROM producto p
JOIN detalle_venta dv 
    ON p.id = dv.id_producto
GROUP BY p.nombre, p.tipo;

-- Consulta de productos con ingresos mayores a 50000
SELECT producto,
       ingresos_totales
FROM reporte_productos_vendidos
WHERE ingresos_totales > 50000;

-- Vista detallada de ventas
-- Une informacion de ventas, clientes y productos
CREATE VIEW vista_detalle_ventas AS
SELECT 
    v.id AS id_venta,
    v.fecha,
    c.nombre AS cliente,
    u.nombre AS usuario,
    p.nombre AS producto,
    p.tipo,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal
FROM venta v
JOIN cliente c 
    ON v.id_cliente = c.id
JOIN usuario u 
    ON v.id_usuario = u.id
JOIN detalle_venta dv 
    ON v.id = dv.id_venta
JOIN producto p 
    ON dv.id_producto = p.id;

-- Vista de productos alcoholicos
CREATE VIEW vista_productos_alcoholicos AS
SELECT *
FROM producto
WHERE tipo = 'alcoholico'
WITH CHECK OPTION;

-- Insercion valida en la vista
INSERT INTO vista_productos_alcoholicos
(nombre, tipo, precio, cantidad_stock, marca)
VALUES
('Cerveza Poker', 'alcoholico', 5000, 50, 'Poker');

-- Insercion invalida
-- Genera error por CHECK OPTION
INSERT INTO vista_productos_alcoholicos
(nombre, tipo, precio, cantidad_stock, marca)
VALUES
('Coca Cola', 'no alcoholico', 4000, 30, 'Coca Cola');


-- =====================================================
-- ROLES Y SEGURIDAD
-- =====================================================

-- Roles del sistema
CREATE ROLE rol_reportes;
CREATE ROLE rol_operador;

-- Usuarios de base de datos
CREATE USER usuario_reportes 
WITH LOGIN PASSWORD 'reportes123';

CREATE USER usuario_operador 
WITH LOGIN PASSWORD 'operador123';

CREATE USER usuario_admin 
WITH LOGIN PASSWORD 'admin123';

-- Permisos para reportes
GRANT SELECT 
ON reporte_productos_vendidos 
TO rol_reportes;

GRANT SELECT 
ON vista_detalle_ventas 
TO rol_reportes;

-- Permisos para operador
GRANT SELECT, INSERT 
ON venta 
TO rol_operador;

GRANT SELECT, INSERT 
ON detalle_venta 
TO rol_operador;

GRANT SELECT 
ON cliente 
TO rol_operador;


-- Asignacion de roles
GRANT rol_reportes 
TO usuario_reportes;

GRANT rol_operador 
TO usuario_operador;


-- Permisos completos para administrador
GRANT ALL PRIVILEGES 
ON ALL TABLES IN SCHEMA public 
TO usuario_admin;

-- =====================================================
-- CONSULTAS DE VERIFICACION
-- =====================================================

-- Verifica permisos asignados
SELECT grantee, 
       table_name, 
       privilege_type
FROM information_schema.role_table_grants
WHERE grantee IN (
    'usuario_reportes',
    'usuario_operador',
    'usuario_admin',
    'rol_reportes',
    'rol_operador'
)
AND table_schema = 'public'
ORDER BY grantee, table_name;

-- Verifica herencia de roles
SELECT u.rolname AS usuario,
       r.rolname AS rol_heredado
FROM pg_auth_members m
JOIN pg_roles r 
    ON m.roleid = r.oid
JOIN pg_roles u 
    ON m.member = u.oid;

-- =====================================================
-- VISTA DETALLADA ORDENADA
-- =====================================================
CREATE OR REPLACE VIEW vista_detalle_ventas AS
SELECT
    v.id AS id_venta,
    v.fecha,
    c.nombre AS cliente,
    u.nombre AS usuario,
    p.nombre AS producto,
    p.tipo,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal
FROM venta v
INNER JOIN cliente c
    ON v.id_cliente = c.id
INNER JOIN usuario u
    ON v.id_usuario = u.id
INNER JOIN detalle_venta dv
    ON v.id = dv.id_venta
INNER JOIN producto p
    ON dv.id_producto = p.id
ORDER BY v.fecha DESC, v.id DESC;

-- =====================================================
-- FUNCION: OBTENER TOTAL DE VENTAS
-- =====================================================

-- Funcion que calcula el dinero total vendido
-- en todas las ventas registradas
CREATE OR REPLACE FUNCTION obtener_total_ventas()
RETURNS NUMERIC AS $$

DECLARE
    total NUMERIC;

BEGIN

    -- Suma todos los valores de la columna total
    SELECT SUM(total)
    INTO total
    FROM venta;

    -- Retorna el total de ventas
    RETURN total;

END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONSULTA CON HAVING
-- =====================================================

-- Muestra productos que se han vendido
-- mas de 2 veces
SELECT 
    p.nombre,
    SUM(dv.cantidad) AS total_vendido
FROM producto p
JOIN detalle_venta dv
    ON p.id = dv.id_producto
GROUP BY p.nombre
HAVING SUM(dv.cantidad) > 2;

