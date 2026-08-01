package com.prueba.crudproductos.service;

import com.prueba.crudproductos.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {

    Producto guardarProducto(Producto producto);

    List<Producto> listarProductos();

    Optional<Producto> obtenerProductoPorId(Long id);

    Producto actualizarProducto(Long id, Producto producto);

    void eliminarProducto(Long id);

}