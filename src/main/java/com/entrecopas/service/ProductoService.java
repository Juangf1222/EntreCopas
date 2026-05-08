package com.entrecopas.service;

import com.entrecopas.model.Producto;
import com.entrecopas.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listar() {
        return repository.listar();
    }

    public void guardar(Producto producto) {
        repository.guardar(producto);
    }

    public List<Producto> buscarPorTipo(String tipo) {
    return repository.buscarPorTipo(tipo);
}
}