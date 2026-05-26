package com.entrecopas.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import com.entrecopas.model.DetalleVenta;

@Repository
public class DetalleVentaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void guardar(DetalleVenta detalle) {
        String sql = """
            INSERT INTO detalle_venta(id_venta, id_producto, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)
        """;

        jdbcTemplate.update(
            sql,
            detalle.getIdVenta(),
            detalle.getIdProducto(),
            detalle.getCantidad(),
            detalle.getPrecioUnitario()
        );
    }
}