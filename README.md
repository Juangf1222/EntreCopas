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
git clone https://github.com/Juangf1222/EntreCopas
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

### 5. Ejecutar el proyecto

Con Maven:

```bash
mvnw.cmd spring-boot:run
```

o ejecutando la clase:

```text
EntrecopasApplication.java
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
| GET | /productos | Retorna todos los productos |
| GET | /productos/{id} | Retorna un producto por ID |
| GET | /productos?tipo=alcoholico | Filtra productos por tipo |
| POST | /productos | Crea un nuevo producto |
| PUT | /productos/{id} | Actualiza un producto existente |
| DELETE | /productos/{id} | Elimina un producto |
| GET | /ventas | Retorna todas las ventas |
| POST | /ventas | Registra una nueva venta |
| GET | /usuarios | Retorna todos los usuarios |
| GET | /proveedores | Retorna todos los proveedores |

---

## Requerimientos funcionales

El sistema implementa las siguientes funcionalidades principales:

- Gestión de clientes
- Gestión de productos
- Registro de ventas
- Administración de usuarios
- Administración de proveedores
- Consulta de reportes y resumen de ventas
- Filtrado de productos por tipo
- Consulta de ventas asociadas a clientes

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
