package com.entrecopas.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.entrecopas.model.Usuario;
import com.entrecopas.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final JdbcTemplate jdbcTemplate;
    private final UsuarioService service;

    public UsuarioController(JdbcTemplate jdbcTemplate, UsuarioService service) {
        this.jdbcTemplate = jdbcTemplate;
        this.service = service;
    }

    // EL LOGIN QUE YA TENÍAS
    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String contrasena = credenciales.get("contrasena");
        String sql = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id"));
                u.setNombre(rs.getString("nombre"));
                u.setCorreo(rs.getString("correo"));
                u.setRol(rs.getString("rol"));
                return u;
            }, correo, contrasena);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
    }

    // LOS DOS NUEVOS ENDPOINTS PARA ADMINISTRAR EMPLEADOS
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return service.listar();
    }

    @PostMapping
    public void crearUsuario(@RequestBody Usuario usuario) {
        service.guardar(usuario);
    }
}