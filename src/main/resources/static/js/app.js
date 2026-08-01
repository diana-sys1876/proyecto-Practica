const API = "http://localhost:8080/productos";

const formulario = document.getElementById("productoForm");
const tabla = document.getElementById("tablaProductos");

window.onload = listarProductos;

async function listarProductos() {

    try {

        const respuesta = await fetch(API);

        if (!respuesta.ok) {
            throw new Error("Error al obtener productos");
        }

        const productos = await respuesta.json();

        tabla.innerHTML = "";

        if (productos.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No hay productos registrados.
                    </td>
                </tr>
            `;

            return;
        }

        productos.forEach(producto => {

            tabla.innerHTML += `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${Number(producto.precio).toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria}</td>
                    <td>

                        <button class="btn btn-warning btn-sm"
                            onclick="editarProducto(${producto.id})">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm"
                            onclick="eliminarProducto(${producto.id})">
                            Eliminar
                        </button>

                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);
        alert("No fue posible cargar los productos.");

    }

}

formulario.addEventListener("submit", async function (e) {

    e.preventDefault();

    const id = document.getElementById("id").value;

    const producto = {

        nombre: document.getElementById("nombre").value.trim(),
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value),
        categoria: document.getElementById("categoria").value

    };

    if (producto.nombre.length < 3) {

        alert("El nombre debe tener al menos 3 caracteres.");
        document.getElementById("nombre").focus();
        return;

    }

    if (isNaN(producto.precio) || producto.precio <= 0) {

        alert("El precio debe ser mayor que 0.");
        document.getElementById("precio").focus();
        return;

    }

    if (isNaN(producto.stock) || producto.stock < 0) {

        alert("El stock no puede ser negativo.");
        document.getElementById("stock").focus();
        return;

    }

    if (producto.stock > 1000) {

        alert("El stock no puede ser mayor a 1000 unidades.");
        document.getElementById("stock").focus();
        return;

    }

    if (producto.categoria === "") {

        alert("Seleccione una categoría.");
        document.getElementById("categoria").focus();
        return;

    }

    try {

        let respuesta;

        if (id === "") {

            respuesta = await fetch(API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(producto)

            });

        } else {

            respuesta = await fetch(API + "/" + id, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(producto)

            });

        }

        if (!respuesta.ok) {

            alert("Ocurrió un error al guardar el producto.");
            return;

        }

        formulario.reset();
        document.getElementById("id").value = "";

        document.querySelector("button[type='submit']").textContent = "Guardar Producto";

        listarProductos();

    } catch (error) {

        console.error(error);
        alert("Error de conexión con el servidor.");

    }

});

async function editarProducto(id) {

    try {

        const respuesta = await fetch(API + "/" + id);

        if (!respuesta.ok) {
            throw new Error("No encontrado");
        }

        const producto = await respuesta.json();

        document.getElementById("id").value = producto.id;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("stock").value = producto.stock;
        document.getElementById("categoria").value = producto.categoria;

        document.querySelector("button[type='submit']").textContent = "Actualizar Producto";

    } catch (error) {

        console.error(error);
        alert("No fue posible cargar el producto.");

    }

}

async function eliminarProducto(id) {

    const confirmar = confirm("¿Desea eliminar este producto?");

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(API + "/" + id, {

            method: "DELETE"

        });

        if (!respuesta.ok) {

            alert("No fue posible eliminar el producto.");
            return;

        }

        listarProductos();

    } catch (error) {

        console.error(error);
        alert("Error de conexión con el servidor.");

    }

}