package com.entrecopas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entrecopas.model.Producto;
import com.entrecopas.service.ProductoService;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> guardar(@RequestBody Producto producto) {
        service.guardar(producto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/buscar")
    public List<Producto> buscar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String marca) {
        return service.filtrarProductos(tipo, marca);
    }

    @GetMapping(params = "tipo")public List<Producto> buscarPorTipo(@RequestParam String tipo) {
        return service.buscarPorTipo(tipo);
    }

    @GetMapping("/resumen-precios")
    public Double verResumen() {
        return service.obtenerResumenPrecios();
    }

    @GetMapping("/paginado")
    public List<Producto> listarPaginado(
            @RequestParam(defaultValue = "10") int size, 
            @RequestParam(defaultValue = "0") int page) {
        return service.obtenerProductosPaginados(size, page);
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizar(@PathVariable int id, @RequestBody Producto producto) {
        producto.setId(id);
        service.actualizar(producto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stock-bajo")
    public List<Producto> stockBajo() {
        return service.obtenerStockBajo();
    }

    @PutMapping("/reponer/{id}")
    public void reponer(@PathVariable int id) {
        service.reponerStock(id);
    }

    @GetMapping("/precio-superior-promedio")
    public List<Producto> productosMasCarosQuePromedio() {
        return service.productosMasCarosQuePromedio();
    }
}
