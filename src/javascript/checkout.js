let cart = JSON.parse(localStorage.getItem("cart")) || [];

let desconto = 0;
let frete = 0;

function render() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, i) => {
    const totalItem = item.price * item.quantity;
    subtotal += totalItem;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}" class="cart-img">

      <div>
        <p>${item.name}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>

      <div class="qtd">
        <button onclick="menos(${i})">-</button>
        <span>${item.quantity}</span>
        <button onclick="mais(${i})">+</button>
      </div>

      <button onclick="remover(${i})">🗑️</button>
    `;

    container.appendChild(div);
  });

  let total = subtotal - desconto + frete;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("desconto").innerText = desconto.toFixed(2);
  document.getElementById("frete").innerText = frete.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* FUNÇÕES */
function mais(i) {
  cart[i].quantity++;
  render();
}

function menos(i) {
  if (cart[i].quantity > 1) {
    cart[i].quantity--;
  } else {
    cart.splice(i, 1);
  }
  render();
}

function remover(i) {
  cart.splice(i, 1);
  render();
}

/* CUPOM */
function aplicarCupom() {
  const valor = document.getElementById("cupom").value;

  if (valor === "DESCONTO10") {
    desconto = 10;
    alert("Cupom aplicado!");
  } else {
    desconto = 0;
    alert("Cupom inválido");
  }

  render();
}

/* FRETE */
function calcularFrete() {
  const cep = document.getElementById("cep").value;

  if (cep.length >= 8) {
    frete = 20;
    document.getElementById("frete-texto").innerText = "Frete: R$ 20";
  } else {
    alert("CEP inválido");
  }

  render();
}

render();