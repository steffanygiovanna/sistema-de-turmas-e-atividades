document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const confirmarSenhaInput = document.getElementById("confirmar-senha");
    const messageDiv = document.getElementById("message");
    const btnCadastrar = document.querySelector(".btn-cadastrar");

    btnCadastrar.addEventListener("click", (e) => {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmarSenha = confirmarSenhaInput.value.trim();

        messageDiv.innerHTML = "";
        messageDiv.style.color = "";

        if (!nome) {
            showMessage("Por favor, insira seu nome completo.", "red");
            return;
        }

        if (!validateEmail(email)) {
            showMessage("Por favor, insira um e-mail válido.", "red");
            return;
        }

        if (senha.length < 6) {
            showMessage("A senha precisa ter pelo menos 6 caracteres.", "red");
            return;
        }

        if (senha !== confirmarSenha) {
            showMessage("As senhas não coincidem.", "red");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (usuarios.find(u => u.email === email)) {
            showMessage("Este e-mail já está cadastrado.", "red");
            return;
        }

        usuarios.push({ nome, email, senha });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        showMessage("Cadastro realizado com sucesso! Redirecionando...", "green");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });

    function showMessage(msg, color) {
        messageDiv.textContent = msg;
        messageDiv.style.color = color;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
