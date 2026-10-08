
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. SISTEMA DE CUENTAS
    // =========================================

    const CLAVE_CUENTAS = "nexus_cuentas";
    const CLAVE_SESION = "nexus_sesion";
    const CLAVE_CARRITO = "nexus_carrito";

    function obtenerCuentas() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CUENTAS) || "[]"
            );

            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            return [];
        }
    }

    function obtenerUsuarioActual() {
        const correo = sessionStorage.getItem(CLAVE_SESION);

        if (!correo) {
            return null;
        }

        return obtenerCuentas().find(function (cuenta) {
            return cuenta.email === correo;
        }) || null;
    }

    function actualizarEncabezado() {
        const invitado = document.getElementById("opcionesInvitado");
        const usuario = document.getElementById("opcionesUsuario");
        const nombre = document.getElementById("nombreUsuario");

        if (!invitado || !usuario || !nombre) {
            return;
        }

        const cuenta = obtenerUsuarioActual();

        invitado.hidden = Boolean(cuenta);
        usuario.hidden = !cuenta;

        nombre.textContent = cuenta
            ? "👤 " + cuenta.nombre
            : "";
    }

    actualizarEncabezado();

    // =========================================
    // 2. CERRAR SESIÓN
    // =========================================

    const btnCerrarSesion =
        document.getElementById("btnCerrarSesion");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function () {
            sessionStorage.removeItem(CLAVE_SESION);
            window.location.href = "index.html";
        });
    }

    // =========================================
    // 3. REGISTRO DE USUARIOS
    // =========================================

    const formRegistro = document.getElementById("formRegistro");
    const aceptarTerminos = document.getElementById("aceptarTerminos");
    const btnRegistro = document.getElementById("btnRegistro");
    const mensajeRegistro = document.getElementById("mensajeRegistro");

    if (aceptarTerminos && btnRegistro) {
        btnRegistro.disabled = !aceptarTerminos.checked;

        aceptarTerminos.addEventListener("change", function () {
            btnRegistro.disabled = !aceptarTerminos.checked;
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener("submit", function (event) {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const emailInput = document.getElementById("email");
            const email = emailInput.value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            const fecha = document.getElementById("fecha").value;
            const telefono = document.getElementById("telefono").value.trim();

            mensajeRegistro.textContent = "";

            if (
                !nombre ||
                !email ||
                !password.trim() ||
                !fecha ||
                !telefono
            ) {
                mensajeRegistro.textContent =
                    "Debes completar todos los campos.";
                return;
            }

            const expresionCorreo =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (
                !expresionCorreo.test(email) ||
                !emailInput.checkValidity()
            ) {
                mensajeRegistro.textContent =
                    "Ingresa un correo electrónico válido.";
                return;
            }

            if (!/^[0-9]{10}$/.test(telefono)) {
                mensajeRegistro.textContent =
                    "El teléfono debe contener exactamente 10 números.";
                return;
            }

            if (!aceptarTerminos || !aceptarTerminos.checked) {
                mensajeRegistro.textContent =
                    "Debes aceptar los términos y condiciones.";
                return;
            }

            const cuentas = obtenerCuentas();

            if (cuentas.some(function (cuenta) {
                return cuenta.email === email;
            })) {
                mensajeRegistro.textContent =
                    "Este correo ya está registrado.";
                return;
            }

            // Demostración académica:
            // No se almacena la contraseña.
            cuentas.push({
                nombre: nombre,
                email: email
            });

            try {
                localStorage.setItem(
                    CLAVE_CUENTAS,
                    JSON.stringify(cuentas)
                );

                sessionStorage.setItem(CLAVE_SESION, email);

            } catch (error) {
                mensajeRegistro.textContent =
                    "No fue posible guardar la cuenta.";
                return;
            }

            window.location.replace("index.html");
        });
    }

    // =========================================
    // 4. INICIAR SESIÓN
    // =========================================

    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail")
                .value.trim().toLowerCase();

            const mensaje = document.getElementById("mensajeLogin");

            if (!email) {
                mensaje.textContent =
                    "Ingresa tu correo electrónico.";
                return;
            }

            const cuenta = obtenerCuentas().find(function (usuario) {
                return usuario.email === email;
            });

            if (!cuenta) {
                mensaje.textContent =
                    "No existe una cuenta con ese correo.";
                return;
            }

           
            sessionStorage.setItem(CLAVE_SESION, email);

            window.location.replace("index.html");
        });
    }

    // =========================================
    // 5. QUIÉNES SOMOS: VER MÁS / VER MENOS
    // =========================================

    const btnVerMas = document.getElementById("btnVerMas");
    const informacionExtra =
        document.getElementById("informacionExtra");

    if (btnVerMas && informacionExtra) {

      
        informacionExtra.hidden = true;

        btnVerMas.textContent = "Ver más";
        btnVerMas.setAttribute("aria-expanded", "false");
        btnVerMas.setAttribute(
            "aria-controls",
            "informacionExtra"
        );

        btnVerMas.addEventListener("click", function () {

            const mostrar = informacionExtra.hidden;

            informacionExtra.hidden = !mostrar;

            btnVerMas.textContent = mostrar
                ? "Ver menos"
                : "Ver más";

            btnVerMas.setAttribute(
                "aria-expanded",
                String(mostrar)
            );

        });
    }

    // =========================================
    // 6. NOTIFICACIONES
    // =========================================

    function mostrarNotificacion(titulo, mensaje) {

        const anterior =
            document.querySelector(".notificacion-carrito");

        if (anterior) {
            anterior.remove();
        }

        const notificacion = document.createElement("div");
        notificacion.className = "notificacion-carrito";
        notificacion.setAttribute("role", "status");

        const icono = document.createElement("div");
        icono.className = "notificacion-icono";
        icono.textContent = "✓";

        const contenido = document.createElement("div");
        contenido.className = "notificacion-contenido";

        const encabezado = document.createElement("strong");
        encabezado.textContent = titulo;

        const descripcion = document.createElement("p");
        descripcion.textContent = mensaje;

        contenido.append(encabezado, descripcion);

        const cerrar = document.createElement("button");
        cerrar.type = "button";
        cerrar.className = "notificacion-cerrar";
        cerrar.textContent = "×";
        cerrar.setAttribute(
            "aria-label",
            "Cerrar notificación"
        );

        cerrar.addEventListener("click", function () {
            notificacion.remove();
        });

        notificacion.append(icono, contenido, cerrar);
        document.body.appendChild(notificacion);

        setTimeout(function () {
            notificacion.remove();
        }, 3000);
    }

    // =========================================
    // 7. CATÁLOGO DE VIDEOJUEGOS
    // =========================================

    const PRODUCTOS = {

        juego1: {
            id: "juego1",
            nombre: "THE FOREST",
            precio: 799,
            imagen: "img/juego1.png",
            categoria: "Supervivencia"
        },

        juego2: {
            id: "juego2",
            nombre: "Among Us",
            precio: 699,
            imagen: "img/juego2.png",
            categoria: "Multijugador"
        },

        juego3: {
            id: "juego3",
            nombre: "GTA V",
            precio: 899,
            imagen: "img/juego3.png",
            categoria: "Acción"
        },

        juego4: {
            id: "juego4",
            nombre: "Tomb Raider",
            precio: 599,
            imagen: "img/juego4.jpg",
            categoria: "Aventura"
        },

        juego5: {
            id: "juego5",
            nombre: "American Truck Simulator",
            precio: 499,
            imagen: "img/juego5.png",
            categoria: "Simulación"
        },

        juego6: {
            id: "juego6",
            nombre: "Minecraft",
            precio: 749,
            imagen: "img/juego6.png",
            categoria: "Construcción"
        }
    };

    // =========================================
    // 8. ALMACENAMIENTO DEL CARRITO
    // =========================================

    function obtenerCarrito() {

        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CARRITO) || "[]"
            );

            if (!Array.isArray(datos)) {
                return [];
            }

            return datos.filter(function (producto) {

                return (
                    producto &&
                    PRODUCTOS[producto.id] &&
                    Number.isSafeInteger(producto.cantidad) &&
                    producto.cantidad > 0
                );

            }).map(function (producto) {

                return {
                    ...PRODUCTOS[producto.id],
                    cantidad: producto.cantidad
                };

            });

        } catch (error) {
            return [];
        }
    }

    function guardarCarrito(carrito) {

        try {
            localStorage.setItem(
                CLAVE_CARRITO,
                JSON.stringify(carrito)
            );

            actualizarContador();

            return true;

        } catch (error) {

            mostrarNotificacion(
                "Error",
                "No se pudo guardar el carrito."
            );

            return false;
        }
    }

    function formatoPrecio(precio) {

        return Number(precio).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // =========================================
    // 9. CONTADOR DEL CARRITO
    // =========================================

    function actualizarContador() {

        const carrito = obtenerCarrito();

        const cantidad = carrito.reduce(function (total, producto) {
            return total + producto.cantidad;
        }, 0);

        document.querySelectorAll(".contador-carrito")
            .forEach(function (elemento) {
                elemento.textContent = cantidad;
            });
    }

    actualizarContador();

    // =========================================
    // 10. AGREGAR PRODUCTOS AL CARRITO
    // =========================================

    const botonesAgregar =
        document.querySelectorAll(".agregar-carrito");

    botonesAgregar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const id = boton.dataset.id;
            const juego = PRODUCTOS[id];

            if (!juego) {

                mostrarNotificacion(
                    "Producto no disponible",
                    "No se encontró el videojuego."
                );

                return;
            }

            const carrito = obtenerCarrito();

            const existente = carrito.find(function (producto) {
                return producto.id === id;
            });

            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({
                    ...juego,
                    cantidad: 1
                });
            }

            if (guardarCarrito(carrito)) {

                mostrarNotificacion(
                    "¡Agregado al carrito!",
                    juego.nombre + " se agregó correctamente."
                );
            }
        });
    });

    // =========================================
    // 11. MOSTRAR PRODUCTOS EN EL CARRITO
    // =========================================

    const listaCarrito = document.getElementById("listaCarrito");
    const carritoVacio = document.getElementById("carritoVacio");
    const carritoContenido =
        document.getElementById("carritoContenido");

    const totalElemento = document.getElementById("total");
    const cantidadTotal =
        document.getElementById("cantidadTotal");

    function mostrarCarrito() {

        if (!listaCarrito || !carritoVacio || !carritoContenido) {
            return;
        }

        const carrito = obtenerCarrito();

        listaCarrito.replaceChildren();

        if (carrito.length === 0) {

            carritoVacio.hidden = false;
            carritoContenido.hidden = true;

            if (totalElemento) {
                totalElemento.textContent = "0.00";
            }

            if (cantidadTotal) {
                cantidadTotal.textContent = "0";
            }

            return;
        }

        carritoVacio.hidden = true;
        carritoContenido.hidden = false;

        let total = 0;
        let cantidadGeneral = 0;

        carrito.forEach(function (producto) {

            const subtotal =
                producto.precio * producto.cantidad;

            total += subtotal;
            cantidadGeneral += producto.cantidad;

            const fila = document.createElement("tr");
            fila.dataset.id = producto.id;

            // IMAGEN Y NOMBRE

            const celdaProducto = document.createElement("td");

            const informacion = document.createElement("div");
            informacion.className = "producto-carrito";

            const imagen = document.createElement("img");
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;

            const nombre = document.createElement("span");
            nombre.textContent = producto.nombre;

            informacion.append(imagen, nombre);
            celdaProducto.appendChild(informacion);

            // PRECIO

            const celdaPrecio = document.createElement("td");

            celdaPrecio.textContent =
                "$" + formatoPrecio(producto.precio);

            // CANTIDAD

            const celdaCantidad = document.createElement("td");

            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.step = "1";
            inputCantidad.value = producto.cantidad;
            inputCantidad.className = "cantidad";

            inputCantidad.setAttribute(
                "aria-label",
                "Cantidad de " + producto.nombre
            );

            inputCantidad.addEventListener("input", function () {

                const nuevaCantidad = Number(inputCantidad.value);

                if (
                    !Number.isSafeInteger(nuevaCantidad) ||
                    nuevaCantidad < 1
                ) {
                    return;
                }

                const carritoActual = obtenerCarrito();

                const actual = carritoActual.find(function (item) {
                    return item.id === producto.id;
                });

                if (actual) {

                    actual.cantidad = nuevaCantidad;

                    if (guardarCarrito(carritoActual)) {
                        actualizarResumen();
                    }
                }
            });

            inputCantidad.addEventListener("change", function () {

                const nuevaCantidad = Number(inputCantidad.value);

                if (
                    !Number.isSafeInteger(nuevaCantidad) ||
                    nuevaCantidad < 1
                ) {

                    const guardado = obtenerCarrito().find(function (item) {
                        return item.id === producto.id;
                    });

                    inputCantidad.value = guardado
                        ? guardado.cantidad
                        : 1;
                }

                mostrarCarrito();
            });

            celdaCantidad.appendChild(inputCantidad);

            // SUBTOTAL

            const celdaSubtotal = document.createElement("td");
            celdaSubtotal.className = "subtotal";

            celdaSubtotal.textContent =
                "$" + formatoPrecio(subtotal);

            // ELIMINAR PRODUCTO

            const celdaAcciones = document.createElement("td");

            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.className = "btn-eliminar";
            btnEliminar.textContent = "🗑 Eliminar";

            btnEliminar.addEventListener("click", function () {

                const nuevoCarrito = obtenerCarrito().filter(
                    function (item) {
                        return item.id !== producto.id;
                    }
                );

                if (guardarCarrito(nuevoCarrito)) {

                    mostrarCarrito();

                    mostrarNotificacion(
                        "Producto eliminado",
                        producto.nombre + " se eliminó del carrito."
                    );
                }
            });

            celdaAcciones.appendChild(btnEliminar);

            fila.append(
                celdaProducto,
                celdaPrecio,
                celdaCantidad,
                celdaSubtotal,
                celdaAcciones
            );

            listaCarrito.appendChild(fila);
        });

        if (totalElemento) {
            totalElemento.textContent = formatoPrecio(total);
        }

        if (cantidadTotal) {
            cantidadTotal.textContent = cantidadGeneral;
        }
    }

    // =========================================
    // 12. ACTUALIZAR TOTALES DEL CARRITO
    // =========================================

    function actualizarResumen() {

        if (!listaCarrito) {
            return;
        }

        const carrito = obtenerCarrito();

        let total = 0;
        let cantidad = 0;

        carrito.forEach(function (producto) {
            total += producto.precio * producto.cantidad;
            cantidad += producto.cantidad;
        });

        const filas = listaCarrito.querySelectorAll("tr");

        filas.forEach(function (fila) {

            const id = fila.dataset.id;

            const producto = carrito.find(function (item) {
                return item.id === id;
            });

            const celda = fila.querySelector(".subtotal");

            if (producto && celda) {

                celda.textContent =
                    "$" + formatoPrecio(
                        producto.precio * producto.cantidad
                    );
            }
        });

        if (totalElemento) {
            totalElemento.textContent = formatoPrecio(total);
        }

        if (cantidadTotal) {
            cantidadTotal.textContent = cantidad;
        }
    }

    mostrarCarrito();

    // =========================================
    // 13. VACIAR CARRITO
    // =========================================

    const btnVaciarCarrito =
        document.getElementById("btnVaciarCarrito");

    if (btnVaciarCarrito) {

        btnVaciarCarrito.addEventListener("click", function () {

            if (obtenerCarrito().length === 0) {
                return;
            }

            if (guardarCarrito([])) {

                mostrarCarrito();

                mostrarNotificacion(
                    "Carrito vacío",
                    "Se eliminaron todos los videojuegos."
                );
            }
        });
    }

    // =========================================
    // 14. BÚSQUEDA DE VIDEOJUEGOS
    // =========================================

    const formBusqueda =
        document.getElementById("formBusqueda");

    if (formBusqueda) {

        const campoBusqueda =
            document.getElementById("buscarProducto");

        const resultadosBusqueda =
            document.getElementById("resultadosBusqueda");

        if (campoBusqueda && resultadosBusqueda) {

            formBusqueda.addEventListener("submit", function (event) {

                event.preventDefault();

                const textoBuscado = campoBusqueda.value.trim();

                resultadosBusqueda.replaceChildren();

                if (textoBuscado === "") {

                    const mensaje = document.createElement("p");
                    mensaje.className = "mensaje-busqueda";

                    mensaje.textContent =
                        "Por favor, escribe el nombre de un videojuego.";

                    resultadosBusqueda.appendChild(mensaje);

                    return;
                }

                const titulo = document.createElement("h3");
                titulo.className = "titulo-resultados";

                titulo.textContent =
                    "Resultados para la búsqueda de " + textoBuscado;

                resultadosBusqueda.appendChild(titulo);

                // Resultados
                const productosFicticios = [
                    PRODUCTOS.juego6,
                    PRODUCTOS.juego3,
                    PRODUCTOS.juego1,
                    PRODUCTOS.juego2,
                    PRODUCTOS.juego4,
                    PRODUCTOS.juego5
                ];

                const lista = document.createElement("div");
                lista.className = "lista-resultados";

                productosFicticios.forEach(function (producto) {

                    const tarjeta = document.createElement("article");
                    tarjeta.className = "resultado-producto";

                    const nombre = document.createElement("h4");
                    nombre.textContent = "🎮 " + producto.nombre;

                    const categoria = document.createElement("p");
                    categoria.textContent =
                        "Categoría: " + producto.categoria;

                    const precio = document.createElement("strong");
                    precio.textContent =
                        "$" + formatoPrecio(producto.precio) + " MXN";

                    tarjeta.appendChild(nombre);
                    tarjeta.appendChild(categoria);
                    tarjeta.appendChild(precio);

                    lista.appendChild(tarjeta);
                });

                resultadosBusqueda.appendChild(lista);
            });
        }
    }

});
