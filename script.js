//
// FASE 1: Modelagem dos dados (Classe Base)
//
class Produto {
    constructor(nome, preco, quantidade) {
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.quantidade = parseInt(quantidade);
    }

    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}

//
// FASE 2: Gerenciamento de Estado e Persistência (LocalStorage)
//
// Função auxiliares para carregar e salvar produtos no LocalStorage
function carregarProdutosDoStorage() {
    const dadosSalvos = localStorage.getItem("produtos_estoque");
    if (!dadosSalvos) return [];
    
    // Converte os dados salvos em instâncias da classe Produto
    const listaJson = JSON.parse(dadosSalvos);
    return listaJson.map(item => new Produto(item.nome, item.preco, item.quantidade));
}

function salvarProdutosNoStorage() {
    localStorage.setItem("produtos_estoque", JSON.stringify(listaDeProdutos));
}

// Array global recarregado a partir do LocalStorage
const listaDeProdutos = carregarProdutosDoStorage();

//
// FASE 3: Escuta de Eventos do DOM
//
const formProduto = document.getElementById("produto-form");
const btnLimparTudo = document.getElementById("limpar-tabela");

// Adicionar produto
formProduto.addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);

    listaDeProdutos.push(novoProduto);
    salvarProdutosNoStorage();
    renderizarTabela();
    formProduto.reset();
});

// Limpar todos os produtos
btnLimparTudo.addEventListener("click", function() {
    if (listaDeProdutos.length === 0) return;

    if (confirm("Deseja realmente remover todos os produtos?")) {
        listaDeProdutos.length = 0; // Limpa o array mantendo a referência
        salvarProdutosNoStorage();
        renderizarTabela();
    }
});

// Remover produto individual usando a função no escopo global
function removerProduto(index) {
    listaDeProdutos.splice(index, 1);
    salvarProdutosNoStorage();
    renderizarTabela();
}

//
// FASE 4: Renderização da Interface DOM
//
function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    const totalEstoqueEl = document.getElementById("total-estoque");

    tabelaBody.innerHTML = "";
    let totalGeral = 0;

    listaDeProdutos.forEach((produto, index) => {
        const subtotal = produto.calcularSubtotal();
        totalGeral += subtotal;

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        tabelaBody.appendChild(linha);
    });

    // Atualiza o total exibido
    totalEstoqueEl.textContent = `Total em Estoque: R$ ${totalGeral.toFixed(2)}`;
}

// Inicialização da renderização na primeira carga da página
renderizarTabela();