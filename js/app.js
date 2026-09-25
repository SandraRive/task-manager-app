const API_URL = 'http://localhost:3000/tasks';

let currentFilter = 'all';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  return tasks;
}

function getFilteredTasks(tasks) {
  if (currentFilter === 'pending') {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter((t) => t.completed);
  }
  return tasks;
}

async function renderTasks() {
  const tasks = await fetchTasks();
  const filtered = getFilteredTasks(tasks);

  taskList.innerHTML = '';

  filtered.forEach((task) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-btn">
      <span>${task.text} (${task.category})</span>
      <button data-id="${task.id}" class="delete-btn">Eliminar</button>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: taskInput.value,
      category: taskCategory.value
    })
  });

  taskInput.value = '';
  renderTasks();
});

taskList.addEventListener('click', async (event) => {
  const id = event.target.dataset.id;

  if (event.target.classList.contains('toggle-btn')) {
    const completed = event.target.checked;

    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    renderTasks();
  }

  if (event.target.classList.contains('delete-btn')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    renderTasks();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    renderTasks();
  });
});

renderTasks();