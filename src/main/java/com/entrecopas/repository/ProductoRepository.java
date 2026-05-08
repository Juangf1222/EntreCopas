package com.entrecopas.repository;

import com.entrecopas.model.Producto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}