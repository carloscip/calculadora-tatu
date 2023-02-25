document.addEventListener("DOMContentLoaded", function (event) {
  let catalogos = {}

  const proveedores = [{
    nombre: 'laPlataLed',
    codigo: 2,
    descripcion: 3,
    precio: 4,
  }, {
    nombre: 'norteDistribuciones',
    codigo: 0,
    descripcion: 1,
    precio: 2,
    descuento: 3
  }, {
    nombre: 'disanco',
    codigo: 2,
    descripcion: 3,
    precio: 4,
  }, {
    nombre: 'electroRodriguez',
    codigo: 0,
    descripcion: 1,
    precio: 2,
  },
  // {
  //   nombre: 'digiglio',
  //   codigo: 0,
  //   descripcion: 1,
  //   precio: 2,
  // }, 
  {
    nombre: 'elMundoFerretero',
    codigo: 0,
    descripcion: 1,
    precio: 3,
  }, {
    nombre: 'trebol',
    codigo: 0,
    descripcion: 1,
    precio: 4,
  }];

  // renderizar resultados query
  const renderResults = (articulos, proveedor) => {
    for (const articulo of articulos) {
      const table = document.getElementById("resultados");
      const row = table.insertRow(0);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cols = Object.keys(articulo);
      row.setAttribute("style", "text-align: center;")
      cell1.innerHTML = articulo[cols[proveedor.codigo]];
      cell2.innerHTML = articulo[cols[proveedor.descripcion]];
      cell3.innerHTML = articulo[cols[proveedor.precio]].toFixed(2);
      if (proveedor.descuento) {
        const caracter = articulo[cols[proveedor.descuento]];
        const prefijo = caracter ? `(${caracter}) ` : '';
        cell2.innerHTML = prefijo + articulo[cols[proveedor.descripcion]];
      }
      cell3.addEventListener("click", (event) => {
        const monto = document.getElementById("monto");
        monto.value = event.target.innerHTML;
        if (proveedor.descuento) {
          const caracter = articulo[cols[proveedor.descuento]];
          const radio1 = document.getElementById("radio1");
          const radio2 = document.getElementById("radio2");
          const radio3 = document.getElementById("radio3");
          if (caracter == '#') {
            radio1.checked = true;
          } else {
            if (caracter == "*") {
              radio2.checked = true;
            } else {
              radio1.checked = false;
              radio2.checked = false;
              radio3.checked = false;
            }
          }
        }
        calcularTotal();
      })
      cell3.setAttribute("class", "button");
      cell3.setAttribute("style", "font-size: 1.5rem;");
      document.getElementById("resultados-table").removeAttribute("style");
    }
  }

  // busqueda de codigo en catalogos
  const find = (codigo) => {
    const table = document.getElementById("resultados-table");
    table.removeChild(table.getElementsByTagName("tbody")[0]);
    const tbody = table.createTBody();
    tbody.setAttribute("id", "resultados");
    for (const proveedor of proveedores) {
      const catalogo = catalogos[proveedor.nombre];
      if (catalogo) {
        const colnames = Object.keys(catalogo[5]);
        const colname = colnames[proveedor.codigo];
        if (colname) {
          const art = catalogos[proveedor.nombre].filter(x => (x[colname] == codigo || x[colname] == codigo.toUpperCase()))
          if (art) {
            renderResults(art, proveedor);
          }
        }
      }
    }
  }

  // para mostrar los proveedores que tenemos
  const renderProveedores = () => {
    for (const proveedor of proveedores) {
      const divProv = document.createElement("div");
      divProv.setAttribute("class", "container");
      const divProv1 = document.createElement("div");
      divProv1.setAttribute("style", "padding: 5px 1rem 5px 1rem");
      divProv1.setAttribute("class", "column");
      let nombre = proveedor.nombre.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
      nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      divProv1.innerHTML = nombre;
      const divProv2 = document.createElement("div");
      divProv2.setAttribute("class", "column");
      divProv2.setAttribute("style", "padding: 5px 1rem 5px 1rem");
      const spanProv = document.createElement("span");
      spanProv.setAttribute("id", proveedor.nombre);
      // apendear todo
      divProv.appendChild(divProv1);
      divProv.appendChild(divProv2);
      divProv2.appendChild(spanProv);
      // finalmente agregarlo a la seccion
      const catalogosSection = document.getElementById("catalogosSection");
      catalogosSection.appendChild(divProv);
    }
  }

  // toggle catalogos section
  let catalogosShown = true;
  const toggleCatalogosSection = () => {
    const catalogosSectionToggle = document.getElementById("catalogosSectionToggle");
    catalogosSectionToggle.addEventListener("click", () => {
      catalogosShown = !catalogosShown;
      const catalogosSection = document.getElementById("catalogosSection");
      catalogosSection.setAttribute("style", `display: ${catalogosShown ? 'none' : 'block'}`)
    })
  }

  // enter event para la busqueda de productos
  window.addEventListener("keydown", function (e) {
    if (13 == e.keyCode) {
      const codigo = document.getElementById("codigo");
      if (codigo) {
        find(codigo.value);
      }
    }
  });

  // event listener del boton de busqueda
  const busqueda = document.getElementById("query");
  busqueda.addEventListener("click", function () {
    const codigo = document.getElementById("codigo");
    if (codigo) {
      find(codigo.value);
    }
  });

  // convertir excel a json
  const parseContent = (data, proveedor) => {
    const wb = XLSX.read(data);
    catalogos[proveedor] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    // console.log(catalogos);
  }

  // load the PDF from file input
  const loadFile = (elm, variable) => {
    const fr = new FileReader();
    fr.onload = () => {
      // almacenar archivo
      localforage.setItem(variable, fr.result);
      // renderizar, hay que poner timeout porque falla sino
      setTimeout(() => {
        initFiles();
      }, 1000);
    };
    fr.readAsArrayBuffer(elm.files[0]);
  };

  // load the PDF from file input
  const removeFile = (variable) => {
    localforage.removeItem(variable);
    initFiles();
  };

  // renderizar botones (borrar, cargar documento)
  const renderButtons = (variable, tipo) => {
    let button;
    if (tipo == 'upload') {
      button = document.createElement("input");
      button.setAttribute("type", "file");
      button.addEventListener("change", (event) => {
        loadFile(event.target, variable);
      })
      button.setAttribute("accept", ".xlsx, .xls, .csv");
    }
    if (tipo == 'delete') {
      button = document.createElement("button");
      button.innerHTML = "Borrar";
      button.addEventListener("click", () => {
        removeFile(variable)
      });
    }

    let span = document.createElement("span");
    span.setAttribute("id", variable);
    span.appendChild(button);
    document.getElementById(variable).replaceWith(span);
  };

  // entrypoint para leer archivos ya cargados en cache
  const initFiles = () => {
    for (const proveedor of proveedores) {
      try {
        const nombre = proveedor.nombre;
        localforage.getItem(nombre, (err, value) => {
          if (err || !value) {
            renderButtons(nombre, 'upload');
          } else {
            renderButtons(nombre, 'delete');
            parseContent(value, nombre);
          }
        });
      } catch(err) {
        console.error(err);
      }
    }
  }

  initFiles();
  renderProveedores();
  toggleCatalogosSection();

  // });
  // document.addEventListener("DOMContentLoaded", function (event) {

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