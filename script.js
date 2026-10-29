const botoes = document.querySelectorAll(".escolha");
const botaoReiniciar = document.getElementById("reiniciar");
const botaoJa = document.getElementById("botaoJa");

const mensagem = document.getElementById("mensagem");
const instrucao = document.getElementById("instrucao");
const contagem = document.getElementById("contagem");

const status1 = document.getElementById("status1");
const status2 = document.getElementById("status2");

const reveal1 = document.getElementById("reveal1");
const reveal2 = document.getElementById("reveal2");

const card1 = document.getElementById("card-player1");
const card2 = document.getElementById("card-player2");

const pontos1 = document.getElementById("pontos1");
const pontos2 = document.getElementById("pontos2");

const nomes = {
  pedra: "🪨 Pedra",
  papel: "📜 Papel",
  tesoura: "✂️ Tesoura"
};

let jogada1 = null;
let jogada2 = null;

let placar1 = 0;
let placar2 = 0;

let rodadaFinalizada = false;
let contando = false;
let rodadaId = 0;
let temporizadores = [];

function limparTemporizadores() {
  temporizadores.forEach(clearTimeout);
  temporizadores = [];
}

function agendar(callback, tempo, id) {
  const temporizador = setTimeout(function () {
    if (id === rodadaId) {
      callback();
    }
  }, tempo);

  temporizadores.push(temporizador);
}

// Registra as escolhas dos jogadores.
botoes.forEach(function (botao) {
  botao.addEventListener("click", function () {
    escolherJogada(
      botao.dataset.player,
      botao.dataset.choice
    );
  });
});

function escolherJogada(jogador, escolha) {
  if (rodadaFinalizada || contando) return;

  if (jogador === "1") {
    if (jogada1 !== null) return;

    jogada1 = escolha;
    bloquearBotoes("1");

    status1.textContent = "Jogada registrada!";
    status2.textContent = "Sua vez de jogar!";

    instrucao.textContent =
      "Jogador 1 escolheu. Vez do jogador 2.";

    card1.classList.remove("ativo");
    card2.classList.add("ativo");

    mensagem.textContent = "Aguardando jogador 2...";
    return;
  }

  if (jogador === "2") {
    if (jogada1 === null || jogada2 !== null) return;

    jogada2 = escolha;
    bloquearBotoes("2");

    status1.textContent = "Pronto!";
    status2.textContent = "Pronto!";

    card1.classList.remove("ativo");
    card2.classList.remove("ativo");

    mensagem.textContent = "Os dois estão prontos!";
    instrucao.textContent =
      "Cliquem em JÁ para revelar o resultado.";

    botaoJa.disabled = false;
  }
}

function bloquearBotoes(jogador) {
  botoes.forEach(function (botao) {
    if (botao.dataset.player === jogador) {
      botao.disabled = true;
    }
  });
}

// O botão central inicia a contagem regressiva.
botaoJa.addEventListener("click", function () {
  if (
    jogada1 === null ||
    jogada2 === null ||
    rodadaFinalizada ||
    contando
  ) {
    return;
  }

  iniciarContagem();
});

function iniciarContagem() {
  contando = true;
  botaoJa.disabled = true;

  const idAtual = rodadaId;

  mensagem.textContent = "Preparem-se!";
  instrucao.textContent =
    "O resultado será revelado no final!";

  let numero = 3;

  function mostrarNumero() {
    if (idAtual !== rodadaId) return;

    contagem.textContent = numero;
    contagem.classList.remove("animar");

    // Reinicia a animação visual.
    void contagem.offsetWidth;
    contagem.classList.add("animar");

    if (numero > 1) {
      numero--;

      agendar(mostrarNumero, 1000, idAtual);
    } else {
      agendar(revelarResultado, 1000, idAtual);
    }
  }

  mostrarNumero();
}

function revelarResultado() {
  if (jogada1 === null || jogada2 === null) return;

  contagem.textContent = "JÁ!";
  contagem.classList.remove("animar");
  void contagem.offsetWidth;
  contagem.classList.add("animar");

  // As escolhas só são reveladas agora.
  reveal1.textContent = "Escolheu: " + nomes[jogada1];
  reveal2.textContent = "Escolheu: " + nomes[jogada2];

  botoes.forEach(function (botao) {
    const jogador = botao.dataset.player;
    const escolha = botao.dataset.choice;

    if (
      (jogador === "1" && escolha === jogada1) ||
      (jogador === "2" && escolha === jogada2)
    ) {
      botao.classList.add("selecionada");
    }
  });

  calcularResultado();
}

function calcularResultado() {
  rodadaFinalizada = true;
  contando = false;

  if (jogada1 === jogada2) {
    mensagem.textContent = "EMPATE!";
    mensagem.className = "mensagem empate";

    instrucao.textContent =
      "Os dois escolheram " + nomes[jogada1] + ".";

  } else if (
    (jogada1 === "pedra" && jogada2 === "tesoura") ||
    (jogada1 === "papel" && jogada2 === "pedra") ||
    (jogada1 === "tesoura" && jogada2 === "papel")
  ) {
    placar1++;

    mensagem.textContent = "JOGADOR 1 VENCEU!";
    mensagem.className = "mensagem vitoria";

    instrucao.textContent =
      nomes[jogada1] + " vence " + nomes[jogada2] + ".";

  } else {
    placar2++;

    mensagem.textContent = "JOGADOR 2 VENCEU!";
    mensagem.className = "mensagem vitoria";

    instrucao.textContent =
      nomes[jogada2] + " vence " + nomes[jogada1] + ".";
  }

  atualizarPlacar();

  status1.textContent = "Rodada finalizada!";
  status2.textContent = "Rodada finalizada!";

  agendar(function () {
    prepararNovaRodada();
  }, 2200, rodadaId);
}

function atualizarPlacar() {
  pontos1.textContent = placar1;
  pontos2.textContent = placar2;
}

function prepararNovaRodada() {
  jogada1 = null;
  jogada2 = null;
  rodadaFinalizada = false;
  contando = false;

  contagem.textContent = "";
  contagem.classList.remove("animar");

  botoes.forEach(function (botao) {
    botao.disabled = false;
    botao.classList.remove("selecionada");
  });

  status1.textContent = "Escolha sua jogada";
  status2.textContent = "Escolha sua jogada";

  reveal1.textContent = "Aguardando jogada...";
  reveal2.textContent = "Aguardando jogada...";

  mensagem.textContent = "Escolham suas jogadas!";
  mensagem.className = "mensagem";

  instrucao.textContent =
    "Jogador 1 começa a partida.";

  botaoJa.disabled = true;

  card1.classList.add("ativo");
  card2.classList.remove("ativo");
}

// Reinicia tudo, incluindo o placar.
botaoReiniciar.addEventListener("click", function () {
  rodadaId++;
  limparTemporizadores();

  jogada1 = null;
  jogada2 = null;

  placar1 = 0;
  placar2 = 0;

  rodadaFinalizada = false;
  contando = false;

  atualizarPlacar();

  contagem.textContent = "";
  contagem.classList.remove("animar");

  botoes.forEach(function (botao) {
    botao.disabled = false;
    botao.classList.remove("selecionada");
  });

  status1.textContent = "Escolha sua jogada";
  status2.textContent = "Escolha sua jogada";

  reveal1.textContent = "Aguardando jogada...";
  reveal2.textContent = "Aguardando jogada...";

  mensagem.textContent = "Escolham suas jogadas!";
  mensagem.className = "mensagem";

  instrucao.textContent =
    "Jogador 1 começa a partida.";

  botaoJa.disabled = true;

  card1.classList.add("ativo");
  card2.classList.remove("ativo");
});

card1.classList.add("ativo");