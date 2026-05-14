package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.ReporteProducto;

@Repository
public class ReporteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReporteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ReporteProducto> obtenerReporteVentas() {
        // Hacemos SELECT directamente a la vista que creaste en SQL
        String sql = "SELECT * FROM reporte_productos_vendidos";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ReporteProducto r = new ReporteProducto();
            r.setProducto(rs.getString("producto"));
            r.setTipo(rs.getString("tipo"));
            r.setTotalVendido(rs.getInt("total_vendido"));
            r.setIngresosTotales(rs.getDouble("ingresos_totales"));
            r.setVecesVendido(rs.getInt("veces_vendido"));
            return r;
        });
    }
}