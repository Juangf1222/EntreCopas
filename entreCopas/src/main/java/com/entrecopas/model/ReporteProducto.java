package com.entrecopas.model;

public class ReporteProducto {
    private String producto;
    private String tipo;
    private int totalVendido;
    private double ingresosTotales;
    private int vecesVendido;

    // Constructores, Getters y Setters
    public ReporteProducto() {}

    public String getProducto() { return producto; }
    public void setProducto(String producto) { this.producto = producto; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public int getTotalVendido() { return totalVendido; }
    public void setTotalVendido(int totalVendido) { this.totalVendido = totalVendido; }
    public double getIngresosTotales() { return ingresosTotales; }
    public void setIngresosTotales(double ingresosTotales) { this.ingresosTotales = ingresosTotales; }
    public int getVecesVendido() { return vecesVendido; }
    public void setVecesVendido(int vecesVendido) { this.vecesVendido = vecesVendido; }
}