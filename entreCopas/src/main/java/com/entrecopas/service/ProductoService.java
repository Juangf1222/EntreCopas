package com.entrecopas.service;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Producto buscarPorId(int id) {
        try {
            return repository.buscarPorId(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "El producto con ID " + id + " no existe.");
        }
    }

    public void actualizar(Producto producto) {
        buscarPorId(producto.getId());
        repository.actualizar(producto);
    }

    public void eliminar(int id) {
        buscarPorId(id);
        repository.eliminar(id);
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

    public List<Producto> obtenerStockBajo() {
        return repository.obtenerStockBajo();
    }
    
    public void reponerStock(int id) {
        repository.reponerStock(id);
    }

    public List<Producto> productosMasCarosQuePromedio() {
        return repository.productosMasCarosQuePromedio();
    }
}
