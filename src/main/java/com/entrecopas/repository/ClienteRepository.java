package com.entrecopas.repository;

import com.entrecopas.model.Cliente;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // LISTAR
    public List<Cliente> listar() {

        String sql = "SELECT * FROM cliente";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {

            Cliente c = new Cliente();

            c.setId(rs.getInt("id"));
            c.setNombre(rs.getString("nombre"));
            c.setDocumento(rs.getString("documento"));
            c.setTelefono(rs.getString("telefono"));
            c.setCorreo(rs.getString("correo"));

            return c;
        });
    }

    // INSERTAR
    public void guardar(Cliente cliente) {

        String sql = """
                INSERT INTO cliente(nombre, documento, telefono, correo)
                VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                cliente.getNombre(),
                cliente.getDocumento(),
                cliente.getTelefono(),
                cliente.getCorreo()
        );
    }

    // BUSCAR POR ID
    public Cliente buscarPorId(int id) {

        String sql = "SELECT * FROM cliente WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {

            Cliente c = new Cliente();

            c.setId(rs.getInt("id"));
            c.setNombre(rs.getString("nombre"));
            c.setDocumento(rs.getString("documento"));
            c.setTelefono(rs.getString("telefono"));
            c.setCorreo(rs.getString("correo"));

            return c;

        }, id);
    }

    // ACTUALIZAR
    public void actualizar(Cliente cliente) {

        String sql = """
                UPDATE cliente
                SET nombre = ?, documento = ?, telefono = ?, correo = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                cliente.getNombre(),
                cliente.getDocumento(),
                cliente.getTelefono(),
                cliente.getCorreo(),
                cliente.getId()
        );
    }

    // ELIMINAR
    public void eliminar(int id) {

        String sql = "DELETE FROM cliente WHERE id = ?";

        jdbcTemplate.update(sql, id);
    }
}