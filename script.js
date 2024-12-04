document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = "https://backend-wheat-eta.vercel.app/api/membros";
    const membroList = document.getElementById('membroList');
    const filterInput = document.getElementById('filter');
    const saveButton = document.getElementById('saveButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cadastroModal = new bootstrap.Modal(document.getElementById('cadastroModal'));
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    let editingMembro = null;
    let deletingMembro = null;

    // Função para carregar os membros
    async function loadMembros() {
        try {
            const response = await fetch(apiUrl);
            const membros = await response.json();
            membroList.innerHTML = '';
            membros.forEach(membro => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `
                    <strong>${membro.nome}</strong><br>
                    ${membro.numeroRol} | ${membro.estadoCivil} | ${membro.situacao}
                    <button class="btn btn-warning btn-sm float-end ms-2" onclick="editMembro('${membro._id}')">Editar</button>
                    <button class="btn btn-danger btn-sm float-end" onclick="confirmDelete('${membro._id}')">Excluir</button>
                `;
                membroList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Erro ao carregar membros:', error);
        }
    }

    // Função para editar membro
    function editMembro(id) {
        alert('teste')
        editingMembro = id;
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(membro => {
                document.getElementById('nome').value = membro.nome;
                document.getElementById('dataNascimento').value = membro.dataNascimento.split('T')[0];  // Formato Date
                document.getElementById('numeroRol').value = membro.numeroRol;
                document.getElementById('estadoCivil').value = membro.estadoCivil;
                document.getElementById('naturalidade').value = membro.naturalidade;
                document.getElementById('situacao').value = membro.situacao;
                cadastroModal.show();
            });
    }

    // Função para salvar ou editar
    saveButton.addEventListener('click', async function() {
        const nome = document.getElementById('nome').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const numeroRol = document.getElementById('numeroRol').value;
        const estadoCivil = document.getElementById('estadoCivil').value;
        const naturalidade = document.getElementById('naturalidade').value;
        const situacao = document.getElementById('situacao').value;

        const membroData = { nome, dataNascimento, numeroRol, estadoCivil, naturalidade, situacao };

        try {
            if (editingMembro) {
                await fetch(`${apiUrl}/${editingMembro}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(membroData)
                });
            } else {
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(membroData)
                });
            }
            cadastroModal.hide();
            loadMembros();
        } catch (error) {
            console.error('Erro ao salvar membro:', error);
        }
    });

    // Função para confirmar exclusão
    function confirmDelete(id) {
        deletingMembro = id;
        confirmDeleteModal.show();
    }

    // Função para excluir membro
    confirmDeleteButton.addEventListener('click', async function() {
        if (deletingMembro) {
            try {
                await fetch(`${apiUrl}/${deletingMembro}`, { method: 'DELETE' });
                loadMembros();
                confirmDeleteModal.hide();
            } catch (error) {
                console.error('Erro ao excluir membro:', error);
            }
        }
    });

    // Função para filtrar membros
    filterInput.addEventListener('input', function() {
        const query = filterInput.value.toLowerCase();
        const listItems = membroList.getElementsByTagName('li');
        Array.from(listItems).forEach(item => {
            const nome = item.querySelector('strong').textContent.toLowerCase();
            item.style.display = nome.includes(query) ? '' : 'none';
        });
    });

    // Carregar membros na inicialização
    loadMembros();
});
