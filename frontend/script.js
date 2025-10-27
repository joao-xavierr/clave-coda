console.log("Script da Bateria carregado com sucesso!");

document.addEventListener('DOMContentLoaded', () => {
  // Seletores
  const startBtn = document.getElementById('start-btn');
  const iaSection = document.getElementById('ia-section');
  const sendBtn = document.getElementById('sendBtn');
  const input = document.getElementById('userInput');
  const chat = document.getElementById('chat');

  // Função para adicionar mensagens ao chat
function addMensagem(remetente, texto, classe) {
  const msg = document.createElement('p');
  if (classe) msg.classList.add(classe); // só adiciona se houver valor
  msg.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}


  // Quando clica no botão "Vamos começar"
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      iaSection.style.display = 'block';
      addMensagem('SoundIA 🧠', 'Oi! Estou aqui para te ajudar a tocar bateria 🎶', 'resposta');
      iaSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Quando clica no botão Enviar
  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const userText = input.value.trim();
      if (!userText) return;

      // Adiciona mensagem do usuário no chat
      addMensagem('Tu', userText);
      input.value = '';

      try {
        // Faz pedido ao backend Node.js
        const resposta = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensagem: userText })
        });

        const data = await resposta.json();
        addMensagem('SoundIA 🧠', data.resposta, 'resposta');
      } catch (erro) {
        console.error('Erro:', erro);
        addMensagem('SoundIA 🧠', 'Ocorreu um erro ao conectar com o servidor 😢', 'resposta');
      }
    });
  }
});
