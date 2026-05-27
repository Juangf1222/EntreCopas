package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.Proveedor;

@Repository
public class ProveedorRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProveedorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Proveedor> listar() {
        String sql = "SELECT * FROM proveedor";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Proveedor p = new Proveedor();
            p.setId(rs.getInt("id"));
            p.setNombre(rs.getString("nombre"));
            p.setTelefono(rs.getString("telefono"));
            p.setDireccion(rs.getString("direccion"));
            p.setCorreo(rs.getString("correo"));
            return p;
        });
    }

    public void guardar(Proveedor proveedor) {
        String sql = "INSERT INTO proveedor (nombre, telefono, direccion, correo) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, proveedor.getNombre(), proveedor.getTelefono(),
                        proveedor.getDireccion(), proveedor.getCorreo());
    }

    public void eliminar(int id) {
        String sql = "DELETE FROM proveedor WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}