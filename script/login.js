document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const messageDiv = document.getElementById("message");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        console.log(senha, email)
        messageDiv.innerHTML = "";
        messageDiv.style.color = "";

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuario = usuarios.find(u => u.email === email);

      
        if(usuario && usuario.email === email && usuario.senha === senha){
            sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            window.location.href = "home.html";
        } else {
            showMessage("Senha ou E-mail Incorreto")
        }

        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        showMessage("Login realizado com sucesso! Redirecionando...", "green");

        setTimeout(() => {
            window.location.href = "./home.html";
        }, 1500);
    });

    function showMessage(msg, color) {
        messageDiv.textContent = msg;
        messageDiv.style.color = color;
    }
});
