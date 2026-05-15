package com.entrecopas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.entrecopas.model.Usuario;
import com.entrecopas.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listar() {
        return repository.listar();
    }

    public void guardar(Usuario usuario) {
        repository.guardar(usuario);
    }
}