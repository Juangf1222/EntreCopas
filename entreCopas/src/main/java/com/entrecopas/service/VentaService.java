package com.entrecopas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entrecopas.model.DetalleVenta;
import com.entrecopas.model.Producto;
import com.entrecopas.model.Venta;
import com.entrecopas.repository.DetalleVentaRepository;
import com.entrecopas.repository.ProductoRepository;
import com.entrecopas.repository.VentaRepository;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final DetalleVentaRepository detalleVentaRepository;

    public VentaService(
            VentaRepository ventaRepository,
            ProductoRepository productoRepository,
            DetalleVentaRepository detalleVentaRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.detalleVentaRepository = detalleVentaRepository;
    }

    @Transactional
    public void registrarVentaCompleta(Venta venta, int idProducto, int cantidadVendida) {

        // Guardar venta y obtener ID generado
        int idVenta = ventaRepository.guardar(venta);

        // Buscar producto
        Producto producto = productoRepository.buscarPorId(idProducto);

        // Crear detalle
        DetalleVenta detalle = new DetalleVenta();

        detalle.setIdVenta(idVenta);
        detalle.setIdProducto(idProducto);
        detalle.setCantidad(cantidadVendida);
        detalle.setPrecioUnitario(producto.getPrecio());

        // Guardar detalle
        detalleVentaRepository.guardar(detalle);

        // Reducir stock
        productoRepository.reducirStock(idProducto, cantidadVendida);
    }

    public List<Venta> listar() {
        return ventaRepository.listar();
    }
}