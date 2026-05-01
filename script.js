const productos = [
  { nombre: "Hamburguesa sencilla", precio: 1500, categoria: "hamburguesas" },
  { nombre: "Hamburguesa con papas", precio: 2000, categoria: "hamburguesas" },
  { nombre: "Hamburguesa mexicana", precio: 2500, categoria: "hamburguesas" },

  { nombre: "Perro caliente", precio: 750, categoria: "perros" },
  { nombre: "Perro con carne + papas", precio: 2000, categoria: "perros" },

  { nombre: "Salchipapa", precio: 2000, categoria: "papas" },
  { nombre: "Papicarne", precio: 2000, categoria: "papas" },
  { nombre: "Salchipapicarne", precio: 3000, categoria: "papas" },
  { nombre: "Papinacho", precio: 2000, categoria: "papas" },
  { nombre: "Orden de papas", precio: 1500, categoria: "papas" },

  { nombre: "Tacos", precio: 2000, categoria: "otros" },
  { nombre: "Chalupa", precio: 2000, categoria: "otros" },
  { nombre: "Burrito", precio: 2500, categoria: "otros" },
  { nombre: "Calzone", precio: 1500, categoria: "otros" }
];

let carrito = [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

function guardarPedidos() {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function mostrarSeccion(id) {
  if (id === "admin") {
    const pass = prompt("Contraseña:");
    if (pass !== "1234") return;
  }

  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "admin") mostrarPedidos();
}

function cargarMenu() {
  productos.forEach((p, i) => {
    const cont = document.getElementById(p.categoria);

    cont.innerHTML += `
      <div class="card">
        <div class="card-icon">
          ${p.categoria === "hamburguesas" ? "🍔" :
            p.categoria === "perros" ? "🌭" :
            p.categoria === "papas" ? "🍟" : "🌮"}
        </div>
        <h4>${p.nombre}</h4>
        <p class="desc">Delicioso y recién preparado</p>
        <div class="card-bottom">
          <span class="precio">₡${p.precio}</span>
          <button onclick="agregar(${i}, this)">Agregar</button>
        </div>
      </div>
    `;
  });
}

function agregar(i, btn) {
  carrito.push(productos[i]);
  renderCarrito();

  btn.innerText = "✔";
  setTimeout(() => btn.innerText = "Agregar", 800);
}

function renderCarrito() {
  const lista = document.getElementById("carrito");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach((p, i) => {
    lista.innerHTML += `
      <li>
        ${p.nombre} ₡${p.precio}
        <button onclick="eliminar(${i})">X</button>
      </li>
    `;
    total += p.precio;
  });

  document.getElementById("total").textContent = total;
}

function eliminar(i) {
  carrito.splice(i, 1);
  renderCarrito();
}

function enviarPedido() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre || !telefono || carrito.length === 0) {
    alert("Completa todo");
    return;
  }

  let detalle = "";
  let total = 0;

  carrito.forEach(p => {
    detalle += "• " + p.nombre + " ₡" + p.precio + "\n";
    total += p.precio;
  });

  pedidos.push({
    nombre,
    telefono,
    estado: "Pendiente",
    detalle,
    total
  });

  guardarPedidos();

  let mensaje = "Pedido:\n" + detalle + "Total ₡" + total;
  window.open(`https://wa.me/50686389958?text=${encodeURIComponent(mensaje)}`);

  carrito = [];
  renderCarrito();
}

function verEstado() {
  const nombre = document.getElementById("buscarNombre").value;
  const telefono = document.getElementById("buscarTelefono").value;

  const pedido = pedidos.find(p => p.nombre === nombre && p.telefono === telefono);

  document.getElementById("resultadoEstado").textContent =
    pedido ? pedido.estado : "No encontrado";
}

function mostrarPedidos() {
  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  pedidos.forEach((p, i) => {
    lista.innerHTML += `
      <li>
        ${p.nombre} - ${p.estado}
        <button onclick="cambiarEstado(${i})">Cambiar</button>
      </li>
    `;
  });
}

function cambiarEstado(i) {
  const estados = ["Pendiente", "En preparación", "Listo"];
  let actual = estados.indexOf(pedidos[i].estado);
  pedidos[i].estado = estados[(actual + 1) % 3];

  guardarPedidos();
  mostrarPedidos();
}

cargarMenu();