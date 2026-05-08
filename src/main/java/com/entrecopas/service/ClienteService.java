package com.entrecopas.service;

import com.entrecopas.model.Cliente;
import com.entrecopas.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() {
        return repository.listar();
    }

    public void guardar(Cliente cliente) {
        repository.guardar(cliente);
    }

    public Cliente buscarPorId(int id) {
        return repository.buscarPorId(id);
    }

    public void actualizar(Cliente cliente) {
        repository.actualizar(cliente);
    }

    public void eliminar(int id) {
        repository.eliminar(id);
    }
}