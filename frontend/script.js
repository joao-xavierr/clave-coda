console.log("Script carregado com sucesso!");

// Nome da chave usada para guardar a sessao simples no navegador.
const chaveSessao = "clavecodaUtilizador";

// Protege a pagina inicial para que apenas utilizadores com sessao entrem.
if (!localStorage.getItem(chaveSessao)) {
  window.location.replace("login.html");
}

// =====================
// CHAT DA IA
// =====================
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const iaSection = document.getElementById('ia-section');
  const sendBtn = document.getElementById('sendBtn');
  const input = document.getElementById('userInput');
  const chat = document.getElementById('chat');
  const aprendizadoBtn = document.getElementById('aprendizado-btn');

  // Movido para fora do fetch para funcionar corretamente logo ao carregar a página
  if (aprendizadoBtn) {
  aprendizadoBtn.addEventListener('click', () => {
    const pagina = document.body.dataset.pagina;
    if (pagina === 'bateria') {
      window.location.href = "aprendizado_bateria.html";
    } else if (pagina === 'violao') {
      window.location.href = "aprendizado_violão.html";
    } else if (pagina === 'baixo') {
      window.location.href = "aprendizado_baixo.html";
    }
  });
}

  function addMensagem(remetente, texto, classes) {
    const msg = document.createElement('p');
    if (classes) {
      classes.split(' ').forEach(c => msg.classList.add(c));
    }
    msg.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return msg;
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      iaSection.style.display = 'block';
      addMensagem('SoundIA 🧠', 'Oi! Estou aqui para te ajudar a tocar bateria 🎶', 'resposta');
      iaSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const userText = input.value.trim();
      if (!userText) return;

      addMensagem('Tu', userText);
      input.value = '';

      const loadingMsg = addMensagem('SoundIA 🧠', 'Pensando...', 'resposta loading');

      try {
        const resposta = await fetch('https://clave-coda-api.onrender.com/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userText })
        });

        const data = await resposta.json();
        const textoResposta = data.resposta || "Sem resposta do modelo.";

        loadingMsg.innerHTML = `<strong>SoundIA 🧠:</strong> ${textoResposta}`;
        loadingMsg.classList.remove('loading');

      } catch (erro) {
        console.error('Erro:', erro);
        loadingMsg.innerHTML = `<strong>SoundIA 🧠:</strong> Ocorreu um erro ao conectar com o servidor 😢`;
        loadingMsg.classList.remove('loading');
      }
    });
  }

  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  }
});


// QUIZ //
function verResultado() {
  let pontos = { 
    "bateria": 0, 
    "guitarra acustica": 0, 
    "baixo": 0 
  };
  
  let totalPerguntas = 7;
  let respondeuTodas = true;

  for (let i = 1; i <= totalPerguntas; i++) {
    let opcaoSelecionada = document.querySelector(`input[name="q${i}"]:checked`);
    
    if (opcaoSelecionada) {
      let valor = opcaoSelecionada.value;
      if (pontos[valor] !== undefined) {
        pontos[valor]++;
      }
    } else {
      respondeuTodas = false;
    }
  }

  if (!respondeuTodas) {
    const divResultado = document.getElementById("resultadoQuiz");
    divResultado.innerHTML = "<p style='color: #ff3333; font-weight: bold;'>⚠️ Por favor, responde a todas as perguntas para veres o teu resultado!</p>";
    divResultado.style.display = "block";
    return;
  }

  const instrumentoVencedor = Object.keys(pontos).reduce((a, b) =>
    pontos[a] > pontos[b] ? a : b
  );

  let mensagem = "";
  if (instrumentoVencedor === "bateria") {
    mensagem = "🥁 Combinais com a <strong>Bateria</strong>!";
  } else if (instrumentoVencedor === "guitarra acustica") {
    mensagem = "🎸 Combinais com a <strong>Guitarra Acústica</strong>!";
  } else if (instrumentoVencedor === "baixo") {
    mensagem = "🎶 Combinais com o <strong>Baixo</strong>!";
  }

  const divResultado = document.getElementById("resultadoQuiz");
  divResultado.innerHTML = `
    <div class="resultado-final">
      <p>${mensagem}</p>
    </div>
  `;
  divResultado.style.display = "block";
}