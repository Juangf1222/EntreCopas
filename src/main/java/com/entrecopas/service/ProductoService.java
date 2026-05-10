package com.entrecopas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.entrecopas.model.Producto;
import com.entrecopas.repository.ProductoRepository;

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

    public Double obtenerResumenPrecios() {
        Double total = repository.obtenerSumaPrecios();
        return (total != null) ? total : 0.0;
    }

    public List<Producto> filtrarProductos(String tipo, String marca) {
        return repository.buscarConFiltros(tipo, marca);
    }

    public List<Producto> obtenerProductosPaginados(int size, int page) {
        return repository.listarPaginado(size, page);
    }
}