# EntreCopas 

## Descripción

EntreCopas es un sistema de gestión para una licorera desarrollado con Spring Boot, JdbcTemplate y PostgreSQL. El sistema permite administrar clientes, productos, ventas, proveedores y usuarios, facilitando el control de inventario y el registro de ventas del negocio.

La aplicación está orientada principalmente para administradores, cajeros y usuarios encargados de reportes y control de ventas.

---

## Integrantes

- Juan Pablo Galindo Florez
- Ana Karina Roa Mora

---

## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Java 17
- PostgreSQL
- Maven
- VS Code o IntelliJ IDEA
- pgAdmin 4 (opcional)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juangf1222/EntreCopas.git
```

---

### 2. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE Licorera;
```

---

### 3. Ejecutar el script SQL

Cargar el archivo `.sql` del proyecto en pgAdmin o PostgreSQL para crear las tablas e insertar los datos iniciales.

---

### 4. Configurar application.properties

Ubicado en:

```text
src/main/resources/application.properties
```

Configurar:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/Licorera
spring.datasource.username=postgres
spring.datasource.password=tu_password

spring.datasource.driver-class-name=org.postgresql.Driver
```

---

### 5. Ejecutar el backend

Con Maven:

```bash
mvnw.cmd spring-boot:run
```

o ejecutando la clase:

```text
EntrecopasApplication.java
```

---
---

### 6. Frontend

El sistema cuenta con una interfaz gráfica desarrollada con:

- React
- TypeScript
- Vite
- TailwindCSS

### Ejecutar frontend

Entrar a la carpeta:

```bash
cd LicoreraVisual
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

## Diagrama ER

https://drive.google.com/file/d/1KJzKGYkgcWEpdgBHt4wBQgCzS5N25Qmg/view?usp=sharing

---

## Endpoints

| Método | URL | Descripción |
|---|---|---|
| GET | /clientes | Retorna todos los clientes |
| GET | /clientes/{id} | Retorna un cliente por ID |
| POST | /clientes | Crea un nuevo cliente |
| PUT | /clientes/{id} | Actualiza un cliente existente |
| DELETE | /clientes/{id} | Elimina un cliente |
| GET | /clientes/{id}/ventas | Retorna las ventas asociadas a un cliente |
| GET | /productos | Retorna todos los productos |
| GET | /productos/{id} | Retorna un producto por ID |
| GET | /productos?tipo=alcoholico | Filtra productos por tipo |
| POST | /productos | Crea un nuevo producto |
| PUT | /productos/{id} | Actualiza un producto existente |
| DELETE | /productos/{id} | Elimina un producto |
| GET | /productos/buscar  | Permite buscar productos aplicando filtros por tipo y/o marca  |
| GET | /productos/resumen-precios  | Retorna la suma total de los precios de todos los productos registrados  |
| GET | /productos/paginado  | Retorna los productos de forma paginada utilizando parámetros de tamaño y página  |
| GET | /productos/stock-bajo   | Retorna la lista de productos cuyo stock es menor a 10 unidades y requieren reposición  |
| PUT | /productos/reponer/{id}   | Repone el stock de un producto específico agregando 50 unidades al inventario   |
| GET | /productos/precio-superior-promedio   | Retorna los productos cuyo precio es superior al precio promedio de todos los productos registrados  |
| GET | /ventas | Retorna todas las ventas |
| POST | /ventas/registrar | Registra una nueva venta |
| GET | /usuarios | Retorna todos los usuarios |
| POST | /usuarios | Crea un nuevo usuario |
| POST | /usuarios/login  | Permite autenticar un usuario mediante correo y contraseña |
| GET | /proveedores | Retorna todos los proveedores |
| POST | /proveedores | Crea un nuevo proveedor |
| DELETE | /proveedores/{id} | Retorna todos los proveedores |
| GET | /reportes/productos-vendidos | Retorna un reporte con los productos vendidos, cantidad total vendida, ingresos generados y número de ventas realizadas |
| GET | /reportes/detalle-ventas | Retorna un resumen general de ventas e ingresos |

---

## Funcionalidades implementadas

- Registro de clientes
- Registro de productos
- Registro de proveedores
- Registro de usuarios
- Gestión de inventario
- Reducción automática de stock al vender
- Reposición automática de stock
- Reportes de ventas
- Productos más vendidos
- Vista de ventas recientes
- Productos con stock bajo
- Filtros por tipo y marca
- Paginación de productos

---

## Características avanzadas SQL

El sistema implementa:

- Vistas SQL
- Funciones almacenadas
- Consultas con HAVING
- Roles y permisos
- Restricciones CHECK
- Llaves foráneas
- Consultas JOIN
- Seguridad por roles

---

## Tecnologías utilizadas

- Java 17
- Spring Boot
- JdbcTemplate
- PostgreSQL
- Maven

---

## Arquitectura del proyecto

El sistema utiliza arquitectura en capas:

```text
controller → service → repository → database
```

y está organizado en los paquetes:

```text
model
repository
service
controller
```

---
## Pruebas realizadas

Se realizaron pruebas:

- Funcionales
- Unitarias
- Validación de endpoints
- Inserción de ventas
- Actualización de inventario
- Consultas SQL
