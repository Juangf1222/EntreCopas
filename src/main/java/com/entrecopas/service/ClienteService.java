package com.entrecopas.service;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.entrecopas.model.Cliente;
import com.entrecopas.model.Venta;
import com.entrecopas.repository.ClienteRepository;
import com.entrecopas.repository.VentaRepository;

@Service
public class ClienteService {

    private final ClienteRepository repository;
    private final VentaRepository ventaRepository;

    public ClienteService(ClienteRepository repository,VentaRepository ventaRepository) {
        this.repository = repository;
        this.ventaRepository = ventaRepository;
    }

    public List<Cliente> listar() {
        return repository.listar();
    }

    public void guardar(Cliente cliente) {
        repository.guardar(cliente);
    }

    public Cliente buscarPorId(int id) {
        try {
            return repository.buscarPorId(id);
        } catch (EmptyResultDataAccessException e) {
            // Al atrapar esta excepción específica, podemos enviar el 404
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El cliente con ID " + id + " no existe."
            );
        } catch (Exception e) {

            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Error interno en el servidor."
            );
        }
    }

    public void actualizar(Cliente cliente) {
        repository.actualizar(cliente);
    }

    public void eliminar(int id) {
        repository.eliminar(id);
    }

    public List<Venta> listarVentasDeCliente(int idCliente) {
        return ventaRepository.buscarVentasPorCliente(idCliente);
    }
}