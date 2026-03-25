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