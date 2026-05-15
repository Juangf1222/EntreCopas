package com.entrecopas.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.entrecopas.model.Usuario;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Usuario> listar() {
        String sql = "SELECT id, nombre, correo, rol FROM usuario"; // No traemos la contraseña por seguridad
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Usuario u = new Usuario();
            u.setId(rs.getInt("id"));
            u.setNombre(rs.getString("nombre"));
            u.setCorreo(rs.getString("correo"));
            u.setRol(rs.getString("rol"));
            return u;
        });
    }

    public void guardar(Usuario usuario) {
        String sql = "INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, usuario.getNombre(), usuario.getCorreo(),
                usuario.getContrasena(), usuario.getRol());
    }
}