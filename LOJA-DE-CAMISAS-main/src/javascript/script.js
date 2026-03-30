document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".filtro button");

    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            const conteudo = botao.nextElementSibling;

            if (conteudo.style.display === "block") {
                conteudo.style.display = "none";
            } else {
                conteudo.style.display = "block";
            }
        });
    });
});

const searchBox = document.querySelector(".search-box");
const input = document.getElementById("searchInput");
const icon = document.querySelector(".search-icon");

// abrir/fechar ao clicar no ícone
icon.addEventListener("click", () => {
  searchBox.classList.toggle("active");
  input.focus();
});

// busca enquanto digita
input.addEventListener("keyup", function(){
  let value = input.value.toLowerCase();
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let title = card.querySelector("h3").innerText.toLowerCase();

    if(title.includes(value)){
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

let cart = [];

const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart");

/* 🔥 AQUI FOI AJUSTADO (com correção da scrollbar) */
cartBtn.addEventListener("click", () => {
  cartPanel.classList.add("active");

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollBarWidth + "px";

  document.body.classList.add("no-scroll");
});

/* 🔥 FUNÇÃO AJUSTADA (sem duplicação) */
function closeCart() {
  cartPanel.classList.remove("active");
  document.body.classList.remove("no-scroll");
  document.body.style.paddingRight = "0px";
}

/* 🔥 já estava certo */
function addToCart(name, price, image) {
  cart.push({ name, price, image });
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const countElement = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");
    li.classList.add("cart-item");

    li.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div>
        <p>${item.name}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>
      <button onclick="removeItem(${index})">X</button>
    `;

    cartItems.appendChild(li);
  });

  totalElement.textContent = total.toFixed(2);
  countElement.textContent = cart.length;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}