document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = "https://backend-wheat-eta.vercel.app/api/membros";
    const membroList = document.getElementById('membroList');
    const filterInput = document.getElementById('filter');
    const saveButton = document.getElementById('saveButton');
    let editingMembro = null;

        // Função para editar membro
        function editMembro(id) {
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
                    const modal = new bootstrap.Modal(document.getElementById('cadastroModal'));
                    modal.show();
                });
        }

    // Função para carregar os membros
    async function loadMembros() {
        try {
            const response = await fetch(apiUrl);
            const membros = await response.json();
            membroList.innerHTML = '';
            membros.forEach(membro => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                let button = document.createElement('button')
                listItem.innerHTML = `
                    <strong>${membro.nome}</strong><br>
                    ${membro.numeroRol} | ${membro.estadoCivil} | ${membro.situacao}
                `;

                  // Criando o botão Editar
                  const editButton = document.createElement('button');
                  editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'float-end', 'ms-2');
                  editButton.textContent = 'Editar';
                  editButton.onclick = function() {
                      editMembro(membro.numeroRol); // Chama a função de edição
                  };
                  listItem.appendChild(editButton);
  
                  // Criando o botão Excluir
                  const deleteButton = document.createElement('button');
                  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
                  deleteButton.textContent = 'Excluir';
                  deleteButton.onclick = function() {
                    deleteMembro(membro._id); // Chama a função de confirmação de exclusão
                  };
                  listItem.appendChild(deleteButton);

                membroList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Erro ao carregar membros:', error);
        }
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
                // Editando
                await fetch(`${apiUrl}/${editingMembro}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(membroData)
                });
                editingMembro = null;
                alert('Alterado com sucesso!')
            } else {
                // Criando novo
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(membroData)
                });
            }
            loadMembros();
            const modal = bootstrap.Modal.getInstance(document.getElementById('cadastroModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao salvar membro:', error);
        }
    });

    // Função para excluir membro
    async function deleteMembro(id) {
        if (confirm('Tem certeza que deseja excluir este membro?')) {
            try {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                loadMembros();
            } catch (error) {
                console.error('Erro ao excluir membro:', error);
            }
        }
    }

    // Função para filtrar membros
    filterInput.addEventListener('input', function() {
        const query = filterInput.value.toLowerCase();
        const listItems = membroList.getElementsByTagName('li');
        Array.from(listItems).forEach(item => {
            const nome = item.querySelector('strong').textContent.toLowerCase();
            if (nome.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Carregar membros ao carregar a página
    loadMembros();
});
