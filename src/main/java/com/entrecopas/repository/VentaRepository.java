package com.entrecopas.repository;

import com.entrecopas.model.Venta;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}