document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});

const iniciarApp = () => {
    buscarPorFecha();
};

const buscarPorFecha = () => {
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", (e) => {
        const fechaSeleccionada = e.target.value;

        window.location = `?fecha=${fechaSeleccionada}`;
    });
};
