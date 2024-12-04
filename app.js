document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = "https://backend-wheat-eta.vercel.app/api/pedidos_revistas";
    const saveButton = document.getElementById('saveButton');
    let editingPedido = null; // Para edição, se necessário

    // Função para salvar ou editar o pedido de revista
    saveButton.addEventListener('click', async function () {
        // Captura os dados do formulário
        const nome = document.getElementById('nome').value;
        const classe = document.querySelector('input[name="classe"]:checked')?.value; // Exemplo: radio button
        const tipoRevista = document.querySelector('input[name="tipoRevista"]:checked')?.value; // Exemplo: radio button
        const quantidade = document.getElementById('quantidade').value;

        // Validação simples
        if (!nome || !classe || !tipoRevista || !quantidade) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Dados para enviar à API
        const pedidoData = { nome, classe, tipoRevista, quantidade };

        try {

            // Criando novo
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedidoData)
            });
            alert('Pedido salvo com sucesso!');

            // Limpa o formulário após salvar
            document.getElementById('formPedido').reset();

            // Fecha o modal, se aplicável (exemplo usando Bootstrap)
            const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroModal'));
            if (modal) modal.hide();
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            alert('Erro ao salvar o pedido. Por favor, tente novamente.');
        }
    });
});
