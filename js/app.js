let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
  if (currentFilter === 'pending') {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter((t) => t.completed);
  }
  return tasks; // 'all'
}

function renderTasks() {
  taskList.innerHTML = '';

  getFilteredTasks().forEach((task) => {
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

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    text: taskInput.value,
    category: taskCategory.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
});

taskList.addEventListener('click', (event) => {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains('toggle-btn')) {
    const task = tasks.find((t) => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }

  if (event.target.classList.contains('delete-btn')) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
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

renderTasks(); // dibuja las tareas guardadas al cargar la página