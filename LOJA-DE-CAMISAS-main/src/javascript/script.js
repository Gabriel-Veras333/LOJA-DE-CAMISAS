document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".filtro button");

    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            const conteudo = botao.nextElementSibling;

            conteudo.style.display =
              conteudo.style.display === "block" ? "none" : "block";
        });
    });
});

const searchBox = document.querySelector(".search-box");
const input = document.getElementById("searchInput");
const icon = document.querySelector(".search-icon");
const overlay = document.getElementById("overlay");

let cart = [];

const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart");

/* 🔥 IMPEDIR FECHAR AO CLICAR DENTRO */
cartPanel.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* 🔥 BUSCA */
icon.addEventListener("click", () => {
  searchBox.classList.toggle("active");
  input.focus();
});

input.addEventListener("keyup", function(){
  let value = input.value.toLowerCase();
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let title = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = title.includes(value) ? "block" : "none";
  });
});

/* 🔥 CARRINHO */
cartBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  cartPanel.classList.toggle("active");
  overlay.classList.toggle("active");

  if (cartPanel.classList.contains("active")) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollBarWidth + "px";
    document.body.classList.add("no-scroll");
  } else {
    closeCart();
  }
});

/* 🔥 FECHAR FORA */
document.addEventListener("click", (e) => {
  if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target)) {
    closeCart();
  }
});

/* 🔥 FECHAR OVERLAY */
overlay.addEventListener("click", closeCart);

/* 🔥 FUNÇÃO FECHAR */
function closeCart() {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
  document.body.style.paddingRight = "0px";
}

/* 🔥 ANIMAÇÃO PRODUTO → CARRINHO */
function animateToCart(imgElement) {
  const cart = document.getElementById("cart-btn");

  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const clone = imgElement.cloneNode(true);

  clone.style.position = "fixed";
  clone.style.top = imgRect.top + "px";
  clone.style.left = imgRect.left + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.zIndex = "9999";
  clone.style.transition = "all 0.8s ease-in-out";
  clone.style.pointerEvents = "none";

  document.body.appendChild(clone);

  setTimeout(() => {
    clone.style.top = cartRect.top + "px";
    clone.style.left = cartRect.left + "px";
    clone.style.width = "20px";
    clone.style.height = "20px";
    clone.style.opacity = "0.5";
  }, 10);

  setTimeout(() => {
    clone.remove();
  }, 800);
}

/* 🔥 NOTIFICAÇÃO EMPILHADA */
function showToast(message) {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.classList.add("toast-container");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2500);
}

/* 🔥 ADICIONAR COM ANIMAÇÃO */
function addToCart(name, price, image, btn) {
  const card = btn.closest(".card");
  const img = card.querySelector("img");

  animateToCart(img);

  const itemExistente = cart.find(item => item.name === name);

  if (itemExistente) {
    itemExistente.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  updateCart();

  showToast("Produto adicionado ao carrinho 🛒");
}

/* 🔥 ATUALIZAR */
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const countElement = document.getElementById("cart-count");

  cartItems.innerHTML = "";

  let total = 0;
  let totalItens = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    totalItens += item.quantity;

    const li = document.createElement("li");
    li.classList.add("cart-item");

    li.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div>
        <p>${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p>R$ ${subtotal.toFixed(2)}</p>
      </div>
      <button onclick="event.stopPropagation(); removeItem(${index})">X</button>
    `;

    cartItems.appendChild(li);
  });

  totalElement.textContent = total.toFixed(2);
  countElement.textContent = totalItens;
}

/* 🔥 REMOVER ITEM */
function removeItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
}