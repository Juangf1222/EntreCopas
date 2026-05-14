package com.entrecopas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.entrecopas.model.Proveedor;
import com.entrecopas.repository.ProveedorRepository;

@Service
public class ProveedorService {

    private final ProveedorRepository repository;

    public ProveedorService(ProveedorRepository repository) {
        this.repository = repository;
    }

    public List<Proveedor> listar() {
        return repository.listar();
    }

    public void guardar(Proveedor proveedor) {
        repository.guardar(proveedor);
    }

    public void eliminar(int id) {
        repository.eliminar(id);
    }
}