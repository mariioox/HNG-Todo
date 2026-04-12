let todos = [
  {
    id: 1,
    title: "Stage 0 Todo Item",
    description: "This is an example task to demonstrate how the todo works.",
    priority: "High",
    deadline: "2026-04-16T18:00",
    completed: false,
  },
];

window.addEventListener("DOMContentLoaded", renderTodos);

function getTimeRemaining(deadline) {
  const now = new Date();
  const target = new Date(deadline);
  const diffInMs = target - now;

  if (diffInMs <= 0) {
    const hoursOverdue = Math.floor(Math.abs(diffInMs) / (1000 * 60 * 60));
    return hoursOverdue === 0 ? "Due now!" : `Overdue by ${hoursOverdue} hours`;
  }

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);

  if (days > 0) return days === 1 ? "Due tomorrow" : `Due in ${days} days`;
  return `Due in ${hours} hours`;
}

function createTodoCard(todo) {
  const timeText = getTimeRemaining(todo.deadline);
  const isDone = todo.completed;

  return `
        <article class="todo-card ${isDone ? "completed" : ""}" data-testid="test-todo-card" data-id="${todo.id}">
            <header>
                <h2 data-testid="test-todo-title" style="text-decoration: ${isDone ? "line-through" : "none"}">
                    ${todo.title}
                </h2>
                <span class="priority-badge" data-testid="test-todo-priority">${todo.priority}</span>
            </header>

            <p data-testid="test-todo-description">${todo.description}</p>

            <div class="todo-details">
                <time data-testid="test-todo-due-date" datetime="${todo.deadline}">
                    Due ${new Date(todo.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
                <span data-testid="test-todo-time-remaining" class="timer">${timeText}</span>
            </div>

            <div class="todo-status">
                Status: <strong data-testid="test-todo-status">${isDone ? "Done" : "Pending"}</strong>
            </div>

            <ul class="tag-list" data-testid="test-todo-tags" role="list">
                <li data-testid="test-todo-tag-work">work</li>
            </ul>

            <div class="todo-actions">
                <label class="toggle-container">
                    <input type="checkbox" data-testid="test-todo-complete-toggle" ${isDone ? "checked" : ""} class="status-toggle">
                    <span>Done</span>
                </label>
                <div class="btn-group">
                    <button data-testid="test-todo-edit-button" aria-label="Edit todo button">Edit</button>
                    <button data-testid="test-todo-delete-button" class="delete-btn" aria-label="Delete todo button">Delete</button>
                </div>
            </div>
        </article>
    `;
}

const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");

function renderTodos() {
  todoList.innerHTML = todos.map((todo) => createTodoCard(todo)).join("");
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTodo = {
    id: Date.now(),
    title: document.getElementById("task-title").value,
    description: document.getElementById("task-desc").value,
    priority: document.getElementById("task-priority").value,
    deadline: document.getElementById("task-deadline").value,
    completed: false,
  };

  todos.push(newTodo);
  todoForm.reset();
  renderTodos();
});

todoList.addEventListener("change", (e) => {
  if (e.target.classList.contains("status-toggle")) {
    const id = e.target.closest(".todo-card").dataset.id;
    const todo = todos.find((t) => t.id == id);
    todo.completed = e.target.checked;
    renderTodos();
  }
});

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.closest(".todo-card").dataset.id;
    todos = todos.filter((t) => t.id != id);
    renderTodos();
  }
});

setInterval(renderTodos, 60000);
