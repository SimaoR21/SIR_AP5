
// Inicializar a lista
// Função para adicionar um novo item à tabela
// Função para adicionar um novo item à tabela
async function createNewItem() {
  const name = document.getElementById('name').value;
  const course = document.getElementById('course').value;
  const year = document.getElementById('year').value;

  if (!name || !course || !year) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const newItem = { name, course, year };

  try {
    // Adiciona o novo item via API
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    });

    if (response.ok) {
      // Recarregar a tabela para refletir o novo item
      loadStudents();
    }
  } catch (error) {
    console.error('Erro ao adicionar estudante:', error);
  }

  // Limpar os campos de entrada
  document.getElementById('name').value = '';
  document.getElementById('course').value = '';
  document.getElementById('year').value = '';
}


// Função para editar o item
function editItem(id) {
  const row = document.getElementById(`item-${id}`);
  const cells = row.getElementsByTagName('td');

  if (row.getAttribute('data-editing') === 'true') return;

  row.setAttribute('data-editing', 'true');
  cells[1].setAttribute('contenteditable', 'true');
  cells[2].setAttribute('contenteditable', 'true');
  cells[3].setAttribute('contenteditable', 'true');

  const editButton = cells[4].getElementsByTagName('button')[0];
  editButton.textContent = 'Salvar';
  editButton.setAttribute('onclick', `saveItem(${id})`);
}

// Função para salvar as alterações do item
// Função para salvar as alterações do item
async function saveItem(id) {
  const row = document.getElementById(`item-${id}`);
  const cells = row.getElementsByTagName('td');

  // Coletar valores atualizados
  const updatedName = cells[1].textContent.trim();
  const updatedCourse = cells[2].textContent.trim();
  const updatedYear = cells[3].textContent.trim();

  // Validação
  if (!updatedName || !updatedCourse || !updatedYear) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Requisição para atualizar no servidor
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: updatedName,
        course: updatedCourse,
        year: updatedYear
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar estudante! Status: ${response.status}`);
    }

    // Confirmar alteração no front-end
    row.removeAttribute('data-editing');
    cells[1].setAttribute('contenteditable', 'false');
    cells[2].setAttribute('contenteditable', 'false');
    cells[3].setAttribute('contenteditable', 'false');

    const editButton = cells[4].getElementsByTagName('button')[0];
    editButton.textContent = 'Editar';
    editButton.setAttribute('onclick', `editItem(${id})`);

    alert('Estudante atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o estudante:', error);
  }
}

// Função para excluir o item
function deleteItem(id) {
  const row = document.getElementById(`item-${id}`);
  row.remove();
}

// Função para carregar os estudantes da API e inserir na tabela
// Esta é a função para carregar os estudantes
// Corrija a URL para incluir "/api/students"
async function loadStudents() {
  try {
    const response = await fetch('/api/students', { cache: 'no-store' }); // Corrigido para "/api/students"
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const students = await response.json();
    const table = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    
    // Limpar a tabela antes de adicionar novos itens
    table.innerHTML = '';

    students.forEach((student) => {
      const newRow = table.insertRow();
      newRow.setAttribute('id', `item-${student.id}`);

      newRow.innerHTML = `
        <td>${student.id}</td>
        <td contenteditable="false">${student.name}</td>
        <td contenteditable="false">${student.course}</td>
        <td contenteditable="false">${student.year}</td>
        <td>
          <button onclick="editItem(${student.id})">Editar</button>
          <button onclick="deleteItem(${student.id})">Remover</button>
        </td>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar os estudantes:', error);
  }
}

// Carregar os estudantes ao iniciar a página
window.onload = loadStudents;



