package com.entrecopas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entrecopas.model.Venta;
import com.entrecopas.service.VentaService;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Venta> listar() {
        return service.listar();
    }

    @PostMapping("/registrar")
    public void registrarVenta(
            @RequestBody Venta venta,
            @RequestParam int idProducto,
            @RequestParam int cantidad) {
        service.registrarVentaCompleta(venta, idProducto, cantidad);
    }
}