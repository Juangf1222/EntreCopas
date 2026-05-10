package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.Venta;

@Repository
public class VentaRepository {

    private final JdbcTemplate jdbcTemplate;

    public VentaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Venta> listar() {

        String sql = "SELECT * FROM venta";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Venta v = new Venta();

            v.setId(rs.getInt("id"));
            v.setFecha(rs.getString("fecha"));
            v.setTotal(rs.getDouble("total"));
            v.setMetodoPago(rs.getString("metodo_pago"));
            v.setIdCliente(rs.getInt("id_cliente"));
            v.setIdUsuario(rs.getInt("id_usuario"));

            return v;
        });
    }

    public List<Venta> buscarVentasPorCliente(int idCliente) {
        // Usamos un JOIN para verificar la relación, aunque filtremos por el ID del cliente
        String sql = """
                SELECT v.* 
                FROM venta v
                INNER JOIN cliente c ON v.id_cliente = c.id
                WHERE c.id = ?
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Venta v = new Venta();
            v.setId(rs.getInt("id"));
            v.setFecha(rs.getString("fecha"));
            v.setTotal(rs.getDouble("total"));
            v.setMetodoPago(rs.getString("metodo_pago"));
            v.setIdCliente(rs.getInt("id_cliente"));
            v.setIdUsuario(rs.getInt("id_usuario"));
            return v;
        }, idCliente);
    }

    public void guardar(Venta venta) {
        String sql = """
                INSERT INTO venta (fecha, total, metodo_pago, id_cliente, id_usuario)
                VALUES (?::date, ?, ?, ?, ?)
                """;
        jdbcTemplate.update(sql, 
            venta.getFecha(), 
            venta.getTotal(), 
            venta.getMetodoPago(), 
            venta.getIdCliente(), 
            venta.getIdUsuario()
        );
    }
}
