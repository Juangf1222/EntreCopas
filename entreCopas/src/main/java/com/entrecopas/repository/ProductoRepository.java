package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.Producto;

@Repository
public class ProductoRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Producto> listar() {

        String sql = "SELECT * FROM producto";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Producto p = new Producto();

            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTipo(rs.getString("tipo"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCantidadStock(rs.getInt("cantidad_stock"));
            p.setMarca(rs.getString("marca"));

            return p;
        });
    }

    public void guardar(Producto producto) {

        String sql = """
                INSERT INTO producto(nombre, tipo, precio, cantidad_stock, marca)
                VALUES (?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                producto.getNombre(),
                producto.getTipo(),
                producto.getPrecio(),
                producto.getCantidadStock(),
                producto.getMarca()
        );
    }

    public List<Producto> buscarPorTipo(String tipo) {

        String sql = "SELECT * FROM producto WHERE tipo = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Producto p = new Producto();

            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTipo(rs.getString("tipo"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCantidadStock(rs.getInt("cantidad_stock"));
            p.setMarca(rs.getString("marca"));

            return p;

        }, tipo);
    }

    public Double obtenerSumaPrecios() {
        
        String sql = "SELECT SUM(precio) FROM producto";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    public List<Producto> buscarConFiltros(String tipo, String marca) {
        StringBuilder sql = new StringBuilder("SELECT * FROM producto WHERE 1=1");

        if (tipo != null && !tipo.isEmpty()) {
            sql.append(" AND tipo = '").append(tipo).append("'");
        }
        if (marca != null && !marca.isEmpty()) {
            sql.append(" AND marca = '").append(marca).append("'");
        }

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> {
            Producto p = new Producto();
            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTipo(rs.getString("tipo"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCantidadStock(rs.getInt("cantidad_stock"));
            p.setMarca(rs.getString("marca"));
            return p;
        });
    }

    public List<Producto> listarPaginado(int size, int page) {
        int offset = page * size;

        String sql = "SELECT * FROM producto LIMIT ? OFFSET ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Producto p = new Producto();
            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTipo(rs.getString("tipo"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCantidadStock(rs.getInt("cantidad_stock"));
            p.setMarca(rs.getString("marca"));
            return p;
        }, size, offset);
    }

    public Producto buscarPorId(int id) {
        String sql = "SELECT * FROM producto WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            
            Producto p = new Producto();
             p.setId(rs.getInt("id"));
             p.setNombre(rs.getString("nombre"));
             p.setTipo(rs.getString("tipo"));
             p.setPrecio(rs.getDouble("precio"));
             p.setCantidadStock(rs.getInt("cantidad_stock"));
             p.setMarca(rs.getString("marca"));
             return p;
            }, id);
        }

    public void reducirStock(int idProducto, int cantidad) {
        String sql = "UPDATE producto SET cantidad_stock = cantidad_stock - ? WHERE id = ?";
        jdbcTemplate.update(sql, cantidad, idProducto);
    }

    public List<Producto> obtenerStockBajo() {
        String sql = "SELECT * FROM producto WHERE cantidad_stock < 10";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Producto p = new Producto();
            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTipo(rs.getString("tipo"));
            p.setPrecio(rs.getDouble("precio"));
            p.setCantidadStock(rs.getInt("cantidad_stock"));
            p.setMarca(rs.getString("marca"));
             return p;
            });
        }

    public void reponerStock(int id) {
        String sql = """
        UPDATE producto SET cantidad_stock = cantidad_stock + 50
        WHERE id = ?""";
        jdbcTemplate.update(sql, id);
    }

    public List<Producto> productosMasCarosQuePromedio() {

    String sql = """
        SELECT *
        FROM producto
        WHERE precio > (
            SELECT AVG(precio)
            FROM producto
        )
    """;

    return jdbcTemplate.query(sql, (rs, rowNum) -> {
        Producto p = new Producto();
        p.setId(rs.getInt("id"));
        p.setNombre(rs.getString("nombre"));
        p.setTipo(rs.getString("tipo"));
        p.setPrecio(rs.getDouble("precio"));
        p.setCantidadStock(rs.getInt("cantidad_stock"));
        p.setMarca(rs.getString("marca"));
        
        return p;
    });
}
}