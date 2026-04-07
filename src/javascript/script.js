let cart = [];

document.addEventListener("DOMContentLoaded", () => {

    const botoes = document.querySelectorAll(".filtro button");
    const searchBox = document.querySelector(".search-box");
    const input = document.getElementById("searchInput");
    const icon = document.querySelector(".search-icon");
    overlay = document.getElementById("overlay");
    const cartBtn = document.getElementById("cart-btn");
    cartPanel = document.getElementById("cart");

    // 🔥 FILTROS
    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            const conteudo = botao.nextElementSibling;

            conteudo.style.display =
              conteudo.style.display === "block" ? "none" : "block";
        });
    });

    // 🔥 CARREGAR CARRINHO SALVO
    let savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCart();
    }

    // =========================
    // 🔥 BOTÃO COMPRAR (SEM ANIMAÇÃO)
    // =========================
    document.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", function(e) {

        e.stopPropagation();

        const card = this.closest(".card");

        let nome = card.querySelector("h3").innerText;
        let preco = parseFloat(
          card.querySelector(".price").innerText
          .replace("R$ ", "")
          .replace(",", ".")
        );
        let imagem = card.querySelector("img").src;

        cart.forEach(item => item.selected = false);

        const itemExistente = cart.find(item => item.name === nome);

        if (itemExistente) {
          itemExistente.quantity += 1;
          itemExistente.selected = true;
        } else {
          cart.push({
            name: nome,
            price: preco,
            image: imagem,
            quantity: 1,
            selected: true
          });
        }

        updateCart();

        cartPanel.classList.add("active");
        overlay.classList.add("active");

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollBarWidth + "px";
        document.body.classList.add("no-scroll");

        showToast("Produto pronto para compra ⚡");
      });
    });

    /* ========================= */
    /* 🔥 BOTÃO DO CARRINHO */
    /* ========================= */
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

    /* 🔥 IMPEDIR FECHAR AO CLICAR DENTRO */
    cartPanel.addEventListener("click", (e) => e.stopPropagation());

    /* 🔥 FECHAR AO CLICAR FORA */
    document.addEventListener("click", (e) => {
      if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target)) {
        closeCart();
      }
    });

    /* 🔥 FECHAR OVERLAY */
    overlay.addEventListener("click", closeCart);

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

});

/* ========================= */
/* 🔥 ANIMAÇÃO (AGORA FUNCIONA) */
/* ========================= */
function animateToCart(imgElement) {
  const cartIcon = document.getElementById("cart-btn");

  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const clone = imgElement.cloneNode(true);

  clone.style.position = "fixed";
  clone.style.top = imgRect.top + "px";
  clone.style.left = imgRect.left + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.zIndex = "9999";
  clone.style.transition = "all 0.8s ease-in-out";
  clone.style.pointerEvents = "none";
  clone.style.borderRadius = "8px";

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

/* ========================= */
/* 🔥 ADICIONAR (CORRIGIDO) */
/* ========================= */
function addToCart(name, price, image, btn) {

  const card = btn.closest(".card");
  const img = card.querySelector("img");

  // 🔥 AGORA TEM ANIMAÇÃO
  animateToCart(img);

  const itemExistente = cart.find(item => item.name === name);

  if (itemExistente) {
    itemExistente.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1,
      selected: true
    });
  }

  updateCart();

  showToast("Produto adicionado ao carrinho 🛒");
}

/* 🔥 NOTIFICAÇÃO */
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

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* 🔥 ATUALIZAR CARRINHO */
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const countElement = document.getElementById("cart-count");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;
  let totalItens = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;

    if (item.selected) total += subtotal;
    totalItens += item.quantity;

    const li = document.createElement("li");
    li.classList.add("cart-item");

li.innerHTML = `
  <input type="checkbox" ${item.selected ? "checked" : ""} 
    onchange="toggleItem(${index})">

  <img src="${item.image}" class="cart-img">

  <div class="cart-info">
    <p class="cart-name">${item.name}</p>

    <div class="qtd-control">
      <button onclick="diminuirQtd(${index})">−</button>
      <span>${item.quantity}</span>
      <button onclick="aumentarQtd(${index})">+</button>
    </div>

    <p class="cart-price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
  </div>

  <button class="delete-btn" onclick="removeItem(${index})">
    <i class="fa-solid fa-trash"></i>
  </button>
`;

    cartItems.appendChild(li);
  });

  totalElement.textContent = total.toFixed(2);
  countElement.textContent = totalItens;

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* 🔥 MARCAR / DESMARCAR */
function toggleItem(index) {
  cart[index].selected = !cart[index].selected;
  updateCart();
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

function VerCarrinho() {
  window.location.href = "carrinho.html";
}

function ContinuarCompra() {
  closeCart();
}

function atualizarTotal() {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  let total = carrinho.reduce((acc, item) => {
    return acc + item.preco;
  }, 0);

  document.getElementById("total").innerText = total.toFixed(2);
}

/* 🔥 ABRIR/FECHAR FILTRO (ESTILO NIKE) */
document.querySelectorAll(".filtro-item button").forEach(botao => {
  botao.addEventListener("click", () => {
    const conteudo = botao.nextElementSibling;

    conteudo.style.display =
      conteudo.style.display === "block" ? "none" : "block";
  });
});

/* 🔥 FILTRAR PRODUTOS */
const checkboxes = document.querySelectorAll(".filters input");

checkboxes.forEach(cb => {
  cb.addEventListener("change", filtrarProdutos);
});

function filtrarProdutos() {
  const cards = document.querySelectorAll(".card");

  const timesSelecionados = [];
  const faixasPreco = [];

  document.querySelectorAll(".filters input:checked").forEach(cb => {
    if (cb.value.includes("-")) {
      // 🔥 faixa de preço
      const [min, max] = cb.value.split("-").map(Number);
      faixasPreco.push({ min, max });
    } else {
      // 🔥 time
      timesSelecionados.push(cb.value);
    }
  });

  cards.forEach(card => {
    const nome = card.dataset.name;
    const preco = parseFloat(card.dataset.price);

    let mostrar = true;

    // 🔥 FILTRO POR TIME
    if (timesSelecionados.length > 0) {
      mostrar = timesSelecionados.includes(nome);
    }

    // 🔥 FILTRO POR FAIXA DE PREÇO
    if (faixasPreco.length > 0) {
      const dentroDeAlgumaFaixa = faixasPreco.some(faixa => {
        return preco >= faixa.min && preco <= faixa.max;
      });

      mostrar = mostrar && dentroDeAlgumaFaixa;
    }

    card.style.display = mostrar ? "block" : "none";
  });
}

function closeCart() {
  if (!cartPanel || !overlay) return;

  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
  document.body.style.paddingRight = "0px";
}

function aumentarQtd(index) {
  cart[index].quantity++;
  updateCart();
}

function diminuirQtd(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeItem(index) {
  if (confirm("Remover este item do carrinho?")) {
    cart.splice(index, 1);
    updateCart();
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("product-list");

  produtos.forEach(produto => {
    const card = document.createElement("div");

    card.classList.add("card");
    card.setAttribute("data-name", produto.categoria);
    card.setAttribute("data-price", produto.preco);

    card.innerHTML = `
      <img src="${produto.imagem}">
      <h3>${produto.nome}</h3>

      <div class="stars">★★★★★</div>

      <p class="price">R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

      <div class="buttons">
        <button onclick="addToCart('${produto.nome}', ${produto.preco}, '${produto.imagem}', this)">
          🛒 Adicionar
        </button>

        <button class="buy-btn">⚡ Comprar</button>
      </div>
    `;

    container.appendChild(card);
  });

});