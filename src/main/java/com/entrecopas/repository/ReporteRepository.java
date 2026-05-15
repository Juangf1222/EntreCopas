package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.ReporteProducto;
import com.entrecopas.model.VistaDetalleVenta;

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

    public List<VistaDetalleVenta> obtenerDetalleVentas() {
        String sql = "SELECT * FROM vista_detalle_ventas";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            VistaDetalleVenta v = new VistaDetalleVenta();
            v.setIdVenta(rs.getInt("id_venta"));
            v.setFecha(rs.getDate("fecha"));
            v.setCliente(rs.getString("cliente"));
            v.setUsuario(rs.getString("usuario"));
            v.setProducto(rs.getString("producto"));
            v.setTipo(rs.getString("tipo"));
            v.setCantidad(rs.getInt("cantidad"));
            v.setPrecioUnitario(rs.getDouble("precio_unitario"));
            v.setSubtotal(rs.getDouble("subtotal"));
            return v;
        });
    }
}