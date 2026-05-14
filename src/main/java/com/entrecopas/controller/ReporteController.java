package com.entrecopas.controller;

import com.entrecopas.model.ReporteProducto;
import com.entrecopas.repository.ReporteRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "*") // Clave para el frontend
public class ReporteController {

    private final ReporteRepository repository;

    public ReporteController(ReporteRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/productos-vendidos")
    public List<ReporteProducto> verReporte() {
        return repository.obtenerReporteVentas();
    }
}