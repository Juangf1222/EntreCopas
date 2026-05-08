package com.entrecopas.controller;

import com.entrecopas.model.Producto;
import com.entrecopas.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @PostMapping
    public void guardar(@RequestBody Producto producto) {
        service.guardar(producto);
    }

    @GetMapping(params = "tipo")public List<Producto> buscarPorTipo(@RequestParam String tipo) {
        return service.buscarPorTipo(tipo);
}
}