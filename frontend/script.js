console.log("Script carregado com sucesso!");

// =====================
// CHAT DA IA
// =====================
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const iaSection = document.getElementById('ia-section');
  const sendBtn = document.getElementById('sendBtn');
  const input = document.getElementById('userInput');
  const chat = document.getElementById('chat');

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
        const resposta = await fetch('http://localhost:3000/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userText })
        });

        const aprendizadoBtn = document.getElementById('aprendizado-btn');
aprendizadoBtn.addEventListener('click', () => {
  window.location.href = "aprendizado_bateria.html"; // redireciona para a nova página
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

// =====================
// QUIZ
// =====================
function verResultado() {
  const form = document.getElementById("quizForm");

  const respostas = {
    q1: form.q1.value,
    q2: form.q2.value,
    q3: form.q3.value,
    q4: form.q4.value,
    q5: form.q5.value,
    q6: form.q6.value,
    q7: form.q7.value
  };

  // Checa se todas as perguntas foram respondidas
  const totalRespondidas = Object.values(respostas).filter(r => r !== "").length;
  if (totalRespondidas < 7) {
    document.getElementById("resultadoQuiz").innerHTML = "<p>⚠️ Por favor, responda todas as perguntas!</p>";
    return;
  }

  let pontos = { bateria: 0, violao: 0, baixo: 0 };
  for (let chave in respostas) {
    if (respostas[chave]) pontos[respostas[chave]]++;
  }

  const instrumento = Object.keys(pontos).reduce((a, b) =>
    pontos[a] > pontos[b] ? a : b
  );

  let mensagem = "";
  if (instrumento === "bateria") {
    mensagem = "🥁 Você combina com a <b>Bateria</b>! Gosta de ritmo e energia!";
  } else if (instrumento === "violao") {
    mensagem = "🎸 Você combina com o <b>Violão</b>! Calmo, melódico e expressivo.";
  } else if (instrumento === "baixo") {
    mensagem = "🎶 Você combina com o <b>Baixo</b>! Equilibrado e com ótima noção de harmonia.";
  }

  document.getElementById("resultadoQuiz").innerHTML = `
    <div class="resultado-final">
      <h3>${mensagem}</h3>
    </div>
  `;


  // =====bateria=====
  document.getElementById("contato-instagram").addEventListener("click", () => {
  window.open("https://instagram.com/SEU_USUARIO", "_blank");
});

}
