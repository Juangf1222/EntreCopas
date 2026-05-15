package com.entrecopas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entrecopas.model.Venta;
import com.entrecopas.repository.ProductoRepository;
import com.entrecopas.repository.VentaRepository;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional 
    public void registrarVentaCompleta(Venta venta, int idProducto, int cantidadVendida) {
        ventaRepository.guardar(venta);

        productoRepository.reducirStock(idProducto, cantidadVendida);
    }

    public List<Venta> listar() {
        return ventaRepository.listar();
    }
}