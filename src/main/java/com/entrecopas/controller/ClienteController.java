package com.entrecopas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.entrecopas.model.Cliente;
import com.entrecopas.model.Venta;
import com.entrecopas.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    @PostMapping
    public void guardar(@RequestBody Cliente cliente) {
        
        if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }

        if (cliente.getDocumento() == null || cliente.getDocumento().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "docuemnto obligatorio");
        }
        
        if (cliente.getCorreo() == null || !cliente.getCorreo().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es invalido");
        }

        service.guardar(cliente);
    }

    @GetMapping("/{id}")
    public Cliente buscar(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public void actualizar(@PathVariable int id,@RequestBody Cliente cliente) {
        cliente.setId(id);
        service.actualizar(cliente);
}

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {
        service.eliminar(id);
    }

    @GetMapping("/{id}/ventas")
    public List<Venta> listarVentas(@PathVariable int id) {
        return service.listarVentasDeCliente(id);
    }
}