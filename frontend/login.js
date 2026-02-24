const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");
const registrarBtn = document.getElementById("registrarBtn");

let modoRegistro = false; // falso = login, true = registrar

// Ao clicar em "Registrar", muda para modo registro
registrarBtn.addEventListener("click", () => {
    modoRegistro = true;
    mensagem.style.color = "#ff0000ff";
    mensagem.textContent = "registro confirmado!!";
});

// LOGIN ou REGISTRO
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


const url = modoRegistro
? "http://localhost:3000/api/register"
: "http://localhost:3000/api/login";


    fetch(url, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mensagem.style.color = "green";
            mensagem.textContent = modoRegistro
                ? "Registro realizado com sucesso!."
                : "Login realizado com sucesso!";
            modoRegistro = false; // volta ao login
            if (!modoRegistro) {
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 1000);
            }
        } else {
            mensagem.style.color = "red";
            mensagem.textContent = data.message || (modoRegistro ? "Registro inválido" : "Login inválido");
        }
    })
    .catch(() => {
        mensagem.style.color = "red";
        mensagem.textContent = "Erro ao conectar com o servidor";
    });
});
