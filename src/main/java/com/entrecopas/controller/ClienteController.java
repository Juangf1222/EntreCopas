package com.entrecopas.controller;

import com.entrecopas.model.Cliente;
import com.entrecopas.service.ClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}