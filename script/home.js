const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const nomeTopo = document.getElementById("turma-logada");
const tabela = document.querySelector("#tabela-turmas tbody");
const areaLista = document.getElementById("area-lista");
const formSection = document.getElementById("form-section");
const form = document.getElementById("form-turma");

if (!usuarioLogado) {
    window.location.href = "login.html";
} else {
    nomeTopo.textContent = `Bem-vindo(a) novamente, Professor(a) ${usuarioLogado.nome}`;
}

document.getElementById("btn-visualizar").addEventListener("click", carregarTurmas);
document.getElementById("btn-cadastrar").addEventListener("click", () => {
    formSection.style.display = "block";
    areaLista.style.display = "none";
});
document.getElementById("btn-limpar").addEventListener("click", excluirTodos);
document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
});

document.getElementById("cancelar").addEventListener("click", () => {
    form.reset();
    formSection.style.display = "none";
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const serie = document.getElementById("serie").value.trim();
    const turno = document.getElementById("turno").value.trim();

    if (!nome || !serie || !turno) {
        alert("Preencha todos os campos!");
        return;
    }

    let turmas = JSON.parse(localStorage.getItem("turmas")) || [];

    if (turmas.some(t => t.nome.toLowerCase() === nome.toLowerCase() && t.professorEmail === usuarioLogado.email)) {
        alert("Você já tem uma turma cadastrada com este nome!");
        return;
    }

    turmas.push({ 
        nome, 
        serie, 
        turno,
        professorEmail: usuarioLogado.email,
        professorNome: usuarioLogado.nome
    });
    localStorage.setItem("turmas", JSON.stringify(turmas));

    alert("Turma cadastrada com sucesso!");
    form.reset();
    formSection.style.display = "none";
    carregarTurmas();
});

function carregarTurmas() {
    let todasTurmas = JSON.parse(localStorage.getItem("turmas")) || [];
    
    let turmasDoProfessor = todasTurmas.filter(t => t.professorEmail === usuarioLogado.email);

    if (turmasDoProfessor.length === 0) {
        alert("Você não tem nenhuma turma cadastrada ainda!");
        return;
    }

    areaLista.style.display = "block";
    tabela.innerHTML = "";

    turmasDoProfessor.forEach((t, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${t.nome}</td>
            <td>${t.serie}</td>
            <td>${t.turno}</td>
            <td>
                <button class="btn-atividades" data-turma="${t.nome}">Atividades</button>
                <button class="btn-excluir" data-index="${index}">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            excluirTurma(index);
        });
    });

    document.querySelectorAll(".btn-atividades").forEach(btn => {
        btn.addEventListener("click", function () {
            const turmaNome = this.getAttribute("data-turma");
            abrirAtividades(turmaNome);
        });
    });
}

function excluirTurma(index) {
    let todasTurmas = JSON.parse(localStorage.getItem("turmas")) || [];
    let turmasDoProfessor = todasTurmas.filter(t => t.professorEmail === usuarioLogado.email);
    
    if (confirm("Deseja realmente excluir esta turma?")) {
        const turmaSelecionada = turmasDoProfessor[index];
        const indexGlobal = todasTurmas.findIndex(t => 
            t.nome === turmaSelecionada.nome && 
            t.professorEmail === usuarioLogado.email
        );
        
        if (indexGlobal !== -1) {
            todasTurmas.splice(indexGlobal, 1);
            localStorage.setItem("turmas", JSON.stringify(todasTurmas));
            carregarTurmas();
        }
    }
}

const atividadesSection = document.getElementById("atividades-section");
const formAtividade = document.getElementById("form-atividade");
const tabelaAtividades = document.getElementById("tabela-atividades");
const turmaSelecionadaSpan = document.getElementById("turma-selecionada");
let turmaAtual = null;

function abrirAtividades(turmaNome) {
    turmaAtual = turmaNome;
    turmaSelecionadaSpan.textContent = turmaNome;
    areaLista.style.display = "none";
    formSection.style.display = "none";
    atividadesSection.style.display = "block";
    tabelaAtividades.style.display = "table";
    formAtividade.style.display = "none";
    carregarAtividades();
}


document.getElementById("voltar-turmas").addEventListener("click", () => {
    atividadesSection.style.display = "none";
    formAtividade.style.display = "none";
    areaLista.style.display = "block";
});

document.getElementById("btn-nova-atividade").addEventListener("click", () => {
    formAtividade.style.display = "block";
    tabelaAtividades.style.display = "none";
});

document.getElementById("cancelar-atividade").addEventListener("click", () => {
    formAtividade.reset();
    formAtividade.style.display = "none";
    tabelaAtividades.style.display = "table";
});


formAtividade.addEventListener("submit", function(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo-atividade").value.trim();
    const descricao = document.getElementById("descricao-atividade").value.trim();
    const dataEntrega = document.getElementById("data-entrega").value;

    let atividades = JSON.parse(localStorage.getItem("atividades")) || {};
    if (!atividades[turmaAtual]) {
        atividades[turmaAtual] = [];
    }

    atividades[turmaAtual].push({
        titulo,
        descricao,
        dataEntrega,
        professorEmail: usuarioLogado.email
    });

    localStorage.setItem("atividades", JSON.stringify(atividades));
    alert("Atividade cadastrada com sucesso!");
    
    formAtividade.reset();
    formAtividade.style.display = "none";
    tabelaAtividades.style.display = "table";
    carregarAtividades();
});

function carregarAtividades() {
    const atividades = JSON.parse(localStorage.getItem("atividades")) || {};
    const atividadesTurma = atividades[turmaAtual] || [];

    const tbody = document.querySelector("#tabela-atividades tbody");
    tbody.innerHTML = "";

    if (atividadesTurma.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhuma atividade cadastrada</td></tr>';
    } else {
        atividadesTurma.forEach((atividade, index) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${atividade.titulo}</td>
                <td>${atividade.descricao}</td>
                <td>${new Date(atividade.dataEntrega).toLocaleDateString()}</td>
                <td>
                    <button class="btn-excluir-atividade" data-index="${index}">Excluir</button>
                </td>
            `;
            tbody.appendChild(linha);
        });
    }

  
    document.querySelectorAll(".btn-excluir-atividade").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            excluirAtividade(index);
        });
    });
}

function excluirAtividade(index) {
    if (confirm("Deseja realmente excluir esta atividade?")) {
        let atividades = JSON.parse(localStorage.getItem("atividades")) || {};
        atividades[turmaAtual].splice(index, 1);
        
        if (atividades[turmaAtual].length === 0) {
            delete atividades[turmaAtual];
        }
        
        localStorage.setItem("atividades", JSON.stringify(atividades));
        carregarAtividades();
    }
}

document.getElementById("voltar-turmas").addEventListener("click", () => {
    atividadesSection.style.display = "none";
    formAtividade.style.display = "none";
    areaLista.style.display = "block";
});

document.getElementById("btn-nova-atividade").addEventListener("click", () => {
    formAtividade.style.display = "block";
    tabelaAtividades.style.display = "none";
});

document.getElementById("cancelar-atividade").addEventListener("click", () => {
    formAtividade.reset();
    formAtividade.style.display = "none";
    tabelaAtividades.style.display = "table";
});

formAtividade.addEventListener("submit", function(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo-atividade").value.trim();
    const descricao = document.getElementById("descricao-atividade").value.trim();
    const dataEntrega = document.getElementById("data-entrega").value;

    let atividades = JSON.parse(localStorage.getItem("atividades")) || {};
    if (!atividades[turmaAtual]) {
        atividades[turmaAtual] = [];
    }

    atividades[turmaAtual].push({
        titulo,
        descricao,
        dataEntrega,
        professorEmail: usuarioLogado.email
    });

    localStorage.setItem("atividades", JSON.stringify(atividades));
    
    formAtividade.reset();
    formAtividade.style.display = "none";
    carregarAtividades();
});

function carregarAtividades() {
    const atividades = JSON.parse(localStorage.getItem("atividades")) || {};
    const atividadesTurma = atividades[turmaAtual] || [];

    const tbody = document.querySelector("#tabela-atividades tbody");
    tbody.innerHTML = "";

    if (atividadesTurma.length === 0) {
        tabelaAtividades.style.display = "none";
        return;
    }

    atividadesTurma.forEach((atividade, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${atividade.titulo}</td>
            <td>${atividade.descricao}</td>
            <td>${new Date(atividade.dataEntrega).toLocaleDateString()}</td>
            <td>
                <button class="btn-excluir-atividade" data-index="${index}">Excluir</button>
            </td>
        `;
        tbody.appendChild(linha);
    });

    tabelaAtividades.style.display = "table";

    document.querySelectorAll(".btn-excluir-atividade").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            excluirAtividade(index);
        });
    });
}

function excluirAtividade(index) {
    if (confirm("Deseja realmente excluir esta atividade?")) {
        let atividades = JSON.parse(localStorage.getItem("atividades")) || {};
        atividades[turmaAtual].splice(index, 1);
        
        if (atividades[turmaAtual].length === 0) {
            delete atividades[turmaAtual];
        }
        
        localStorage.setItem("atividades", JSON.stringify(atividades));
        carregarAtividades();
    }
}

function excluirTodos() {
    if (confirm("Tem certeza que deseja excluir todas as suas turmas?")) {
        let todasTurmas = JSON.parse(localStorage.getItem("turmas")) || [];
        let turmasRestantes = todasTurmas.filter(t => t.professorEmail !== usuarioLogado.email);
        localStorage.setItem("turmas", JSON.stringify(turmasRestantes));
        carregarTurmas();
        localStorage.removeItem("turmas");
        tabela.innerHTML = "";
        areaLista.style.display = "none";
        alert("Todas as turmas foram excluídas!");
    }
}
