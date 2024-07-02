let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: "",
    fecha: "",
    hora: "",
    servicios: [],
};

document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});

const iniciarApp = () => {
    mostrarSeccion();
    tabs();
    botonesPaginador();
    paginaSiguiente();
    paginaAnterior();

    consultarAPI();

    idCliente();
    nombreCliente();
    seleccionarFecha();
    seleccionarHora();

    mostrarResumen();
};

const mostrarSeccion = () => {
    const seccionAnterior = document.querySelector(".mostrar");

    if (seccionAnterior) {
        seccionAnterior.classList.remove("mostrar");
    }

    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add("mostrar");

    const tabAnterior = document.querySelector(".actual");

    if (tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
};

const tabs = () => {
    const botones = document.querySelectorAll(".tabs button");

    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
};

const botonesPaginador = () => {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if (paso === 1) {
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    } else if (paso === 3) {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }
};

const paginaAnterior = () => {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        if (paso <= pasoInicial) return;
        paso--;
        mostrarSeccion();
        botonesPaginador();
    });
};

const paginaSiguiente = () => {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        if (paso >= pasoFinal) return;
        paso++;
        mostrarSeccion();
        botonesPaginador();
    });
};

const consultarAPI = async () => {
    try {
        const url = "/api/servicios";
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
};

const mostrarServicios = (servicios) => {
    servicios.forEach((servicio) => {
        const { id, nombre, precio } = servicio;
        const nombreServicio = document.createElement("P");
        nombreServicio.classList.add("nombre-servicio");
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio-servicio");
        precioServicio.textContent = `$${precio}`;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("servicio");
        contenedorServicio.dataset.idServicios = id;
        contenedorServicio.onclick = () => seleccionarServicio(servicio);

        contenedorServicio.appendChild(nombreServicio);
        contenedorServicio.appendChild(precioServicio);

        document.querySelector("#servicios").appendChild(contenedorServicio);
    });
};

const seleccionarServicio = (servicio) => {
    const { id } = servicio;
    const { servicios } = cita;
    const divServicio = document.querySelector(`[data-id-servicios="${id}"]`);

    if (servicios.some((agregado) => agregado.id === id)) {
        cita.servicios = servicios.filter((agregado) => agregado.id !== id);
        divServicio.classList.remove("seleccionado");
    } else {
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add("seleccionado");
    }
};

const idCliente = () => {
    cita.id = document.querySelector('#id').value;
}
const nombreCliente = () => {
    cita.nombre = document.querySelector("#nombre").value;
};
const seleccionarFecha = () => {
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener("input", (e) => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([6, 0].includes(dia)) {
            e.target.value = "";
            mostrarAlerta("Fines de semana no son permitidos", "error", ".formulario");
        } else {
            cita.fecha = e.target.value;
        }
    });
};
const seleccionarHora = () => {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if (hora[0] < 10 || hora[0] > 18) {
            e.target.value = "";
            mostrarAlerta("Hora no valida", "error", ".formulario");
        } else {
            cita.hora = e.target.value;
        }
    });
};
const mostrarAlerta = (mensaje, tipo, elemento, desaparece = true) => {
    const alertaPrevia = document.querySelector(".alerta");
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
};

const mostrarResumen = () => {
    const resumen = document.querySelector(".contenido-resumen");

    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(cita).includes("") || cita.servicios.length === 0) {
        mostrarAlerta("Faltan datos de Servicios, Fecha u Hora", "error", ".contenido-resumen", false);
        return;
    }

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    resumen.appendChild(headingServicios);

    const { nombre, fecha, hora, servicios } = cita;

    servicios.forEach((servicio) => {
        const { id, nombre, precio } = servicio;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");
        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.innerHTML = `<span>Precio: </span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement("P");
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const fechaFormateada = fechaUTC.toLocaleDateString("es-CO", opciones);

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

    const botonReservar = document.createElement("BUTTON");
    botonReservar.classList.add("boton");
    botonReservar.textContent = "Reservar Cita";
    botonReservar.onclick = reserverCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
};

const reserverCita = async () => {
    const { nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map((servicio) => servicio.id);

    const datos = new FormData();
    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("usuarioId", id);
    datos.append("servicios", idServicios);


    try {        
        const url = "/api/citas";
    
        const respuesta = await fetch(url, {
            method: "POST",
            body: datos,
        });
        const resultado = await respuesta.json();
    
        console.log(resultado);
    
        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 500 );
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "ERROR",
            text: "Hubo un error al crear la Cita, intenta de nuevo",
        });
    }

};
