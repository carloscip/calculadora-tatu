document.addEventListener("DOMContentLoaded", function (event) {
    const radiosCol2 = document.querySelectorAll(".csecond input[type='radio']");
    const inputCol2 = document.querySelector(".csecond input[type='number']");
    const radiosCol3 = document.querySelectorAll(".cthird input[type='radio']");
    const inputCol3 = document.querySelector(".cthird input[type='number']");
    const iva = document.getElementById("iva");
    const monto = document.getElementById("monto");
    const total = document.getElementById("total");
    const descuentos = document.getElementById("descuentos");
    const recargos = document.getElementById("recargos");

    // AL INICIO RECARGOS ESTA SELECTED (55%) ENTONCES LO SETEAMOS CON SU VALOR
    recargos.value = 55;

    // CHECKBOXES

    iva.addEventListener("change", () => {
        calcularTotal();
    })

    // RADIOS 

    for (const radio of radiosCol2) {
        radio.addEventListener("change", function () {
            if (radio.checked) {
                inputCol2.value = null;
                descuentos.value = radio.value;
            }
            if (!inputCol2.value) {
                inputCol2.style.backgroundColor = 'transparent';
            }
            calcularTotal();
        });
    }
    for (const radio of radiosCol3) {
        radio.addEventListener("change", function () {
            if (radio.checked) {
                inputCol3.value = null;
                recargos.value = radio.value;
            }
            if (!inputCol3.value) {
                inputCol3.style.backgroundColor = 'transparent';
            }
            calcularTotal();
        });
    }

    // INPUTS 

    inputCol2.addEventListener("focus", () => {
        for (const radio of radiosCol2) {
            radio.checked = false;
        }
        inputCol2.style.backgroundColor = '#20b8be';
        // inputCol2.value = 0;
        descuentos.value = inputCol2.value;
        calcularTotal();
    })
    inputCol2.addEventListener("input", function () {
        if (inputCol2.value < 0) {
            inputCol2.value = 0;
        }
        descuentos.value = inputCol2.value;
        calcularTotal();
    });
    inputCol3.addEventListener("focus", () => {
        for (const radio of radiosCol3) {
            radio.checked = false;
        }
        inputCol3.style.backgroundColor = '#20b8be';
        // inputCol3.value = 0;
        recargos.value = inputCol3.value;
        calcularTotal();
    })
    inputCol3.addEventListener("input", function () {
        if (inputCol3.value < 0) {
            inputCol3.value = 0;
        }
        recargos.value = inputCol3.value;
        calcularTotal();
    });

    // MONTO INPUT

    monto.addEventListener("input", () => {
        if (monto.value < 0) {
            monto.value = 0;
        }
        calcularTotal();
    })

    function calcularTotal() {
        let _total = monto.value;
        if (iva.checked) {
            _total *= 1.21
        }
        _total = _total * (1 - (descuentos.value / 100));
        _total = _total * (1 + (recargos.value / 100));
        total.innerHTML = '$ ' + _total.toFixed(2);
    }
});