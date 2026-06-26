// Procura no HTML o formulario principal de login/registo.
const form = document.getElementById("loginForm");

// Procura o elemento onde vamos mostrar mensagens ao utilizador.
const mensagem = document.getElementById("mensagem");

// Procura o botao que ativa o modo de registo.
const registrarBtn = document.getElementById("registrarBtn");

// Controla se o formulario esta em modo de login ou de registo.
// false = login
// true = registo
let modoRegistro = false;

// Nome da chave usada para guardar a sessao no navegador.
const chaveSessao = "clavecodaUtilizador";

// Limpa todos os campos do formulario.
function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
}

// Quando o utilizador clica em "Registrar", ativamos o modo de registo.
registrarBtn.addEventListener("click", () => {
    // Passa o formulario para modo de registo.
    modoRegistro = true;

    // Limpa os campos para o utilizador comecar o registo do zero.
    limparCampos();

    // Mostra uma mensagem visual a confirmar a mudanca de modo.
    mensagem.style.color = "#ffd700";
    mensagem.textContent = "Modo de registo ativado.";
});

// Quando o formulario e enviado, tratamos login ou registo.
form.addEventListener("submit", function (e) {
    // Impede o recarregamento automatico da pagina.
    e.preventDefault();

    // Vai buscar os valores escritos pelo utilizador.
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Escolhe o endpoint da API conforme o modo atual.
const url = modoRegistro
    ? "https://clave-coda-api.onrender.com/api/register"
    : "https://clave-coda-api.onrender.com/api/login";

    // Envia os dados para o servidor em formato JSON.
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    })
    // Converte a resposta do servidor para JSON.
    .then(res => res.json())
    .then(data => {
        // Se o servidor indicar sucesso, mostramos mensagem positiva.
        if (data.success) {
            mensagem.style.color = "green";
            mensagem.textContent = modoRegistro
                ? "Registro realizado com sucesso!"
                : "Login realizado com sucesso!";

            // Se foi um registo, limpa os campos apos concluir.
            if (modoRegistro) {
                limparCampos();
            }

            // Se foi login, guardamos a sessao no navegador.
            if (!modoRegistro) { // aqui eu usei o "!" para verificar se não é modo de registro, ou seja, é modo de login
                localStorage.setItem(chaveSessao, JSON.stringify({ 
                    nome,
                    email,
                    loginEm: new Date().toISOString()
                }));

                // Redireciona para a pagina inicial apos um pequeno atraso.
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 1000);
            } else {
                // Depois de registar, voltamos o sistema para modo de login.
                modoRegistro = false;
                mensagem.style.color = "#ffd700";
                mensagem.textContent = "Conta criada. Agora faz login com os teus dados.";
            }
        } else {
            // Se o servidor devolver erro, mostramos a mensagem correspondente.
            mensagem.style.color = "red";
            mensagem.textContent = data.message || (modoRegistro ? "Registro invalido" : "Login invalido");
        }
    })
    .catch(() => {
        // Se houver falha de ligacao com o servidor, mostramos erro generico.
        mensagem.style.color = "red";
        mensagem.textContent = "Erro ao conectar com o servidor";
    });
});
