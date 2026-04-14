let todos = [
  {
    id: 1,
    title: "Stage 0 Todo Item",
    description:
      "This is an example task to demonstrate how the todo works. It should be long enough to test the collapse feature.",
    priority: "High",
    deadline: "2026-04-16T18:00",
    status: "Pending",
    completed: false,
    isEditing: false,
    isExpanded: false,
  },
];

window.addEventListener("DOMContentLoaded", renderTodos);

function getTimeRemaining(deadline, status) {
  if (status === "Done") return "Completed";

  const now = new Date();
  const target = new Date(deadline);
  const diffInMs = target - now;
  const absDiff = Math.abs(diffInMs);

  // Math for all units
  const mins = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (diffInMs <= 0) {
    if (days > 0) return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
    return `Overdue by ${mins} minute${mins > 1 ? "s" : ""}`;
  }

  if (days > 0) return `Due in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Due in ${mins} minute${mins > 1 ? "s" : ""}`;
}

function createTodoCard(todo) {
  const timeText = getTimeRemaining(todo.deadline, todo.status);
  const isDone = todo.status === "Done";
  const isInProgress = todo.status === "In Progress";
  const isOverdue = new Date(todo.deadline) < new Date() && !isDone;
  const isExpanded = todo.isExpanded;

  if (todo.isEditing) {
    return `
    <form class="todo-edit-form" data-testid="test-todo-edit-form" data-id="${todo.id}">
      <div class="form-group">
        <label for="edit-title-${todo.id}">Title</label>
        <input type="text" id="edit-title-${todo.id}" data-testid="test-todo-edit-title-input" value="${todo.title}" required>
      </div>
      <div class="form-group">
        <label for="edit-desc-${todo.id}">Description</label>
        <textarea id="edit-desc-${todo.id}" data-testid="test-todo-edit-description-input">${todo.description}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="edit-status-${todo.id}">Status</label>
          <select id="edit-status-${todo.id}" data-testid="test-todo-status-control">
            <option value="Pending" ${todo.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${todo.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Done" ${todo.status === "Done" ? "selected" : ""}>Done</option>
          </select>
        </div>
        <div class="form-group">
          <label for="edit-priority-${todo.id}">Priority</label>
          <select id="edit-priority-${todo.id}" data-testid="test-todo-edit-priority-select">
            <option value="Low" ${todo.priority === "Low" ? "selected" : ""}>Low</option>
            <option value="Medium" ${todo.priority === "Medium" ? "selected" : ""}>Medium</option>
            <option value="High" ${todo.priority === "High" ? "selected" : ""}>High</option>
          </select>
        </div>
        <div class="form-group">
          <label for="edit-date-${todo.id}">Due Date</label>
          <input type="datetime-local" id="edit-date-${todo.id}" data-testid="test-todo-edit-due-date-input" value="${todo.deadline}">
        </div>
      </div>
      <div class="edit-actions btn-group">
        <button type="submit" data-testid="test-todo-save-button" class="save-btn">Save Changes</button>
        <button type="button" data-testid="test-todo-cancel-button" class="cancel-btn">Cancel</button>
      </div>
    </form>`;
  }

  return `
    <article class="todo-card ${todo.priority.toLowerCase()} ${isDone ? "completed" : ""} ${isInProgress ? "in-progress" : ""}" data-testid="test-todo-card" data-id="${todo.id}">
      <div class="priority-indicator" data-testid="test-todo-priority-indicator"></div>    
      <header>
        <h2 data-testid="test-todo-title" style="text-decoration: ${isDone ? "line-through" : "none"}">${todo.title}</h2>
        <span class="priority-badge ${todo.priority.toLowerCase()}" data-testid="test-todo-priority">${todo.priority}</span>
      </header>

      <div class="description-container">
        <div id="desc-content-${todo.id}" data-testid="test-todo-collapsible-section" class="description-text ${isExpanded ? "expanded" : "collapsed"}">
          <p data-testid="test-todo-description">${todo.description}</p>
        </div>
        <button type="button" data-testid="test-todo-expand-toggle" aria-expanded="${isExpanded}" aria-controls="desc-content-${todo.id}" class="expand-btn">
            ${isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <div class="todo-details">
        <time data-testid="test-todo-due-date" datetime="${todo.deadline}">Due ${new Date(todo.deadline).toLocaleDateString()}</time>
        <span data-testid="test-todo-time-remaining" class="timer" aria-live="polite">${timeText}</span>
        ${isOverdue ? `<span class="overdue-label" data-testid="test-todo-overdue-indicator">OVERDUE</span>` : ""}
      </div>

      <div class="todo-status">Status: <strong data-testid="test-todo-status">${todo.status}</strong></div>

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
  </article>`;
}

function renderTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = todos.map((todo) => createTodoCard(todo)).join("");
}

// Global Click Listener
document.getElementById("todo-list").addEventListener("click", (e) => {
  const id = e.target.closest("[data-id]")?.dataset.id;
  if (!id) return;
  const todo = todos.find((t) => t.id == id);

  if (e.target.dataset.testid === "test-todo-edit-button") {
    todo.isEditing = true;
    renderTodos();
  }
  // Cancel Edit
  if (e.target.dataset.testid === "test-todo-cancel-button") {
    todo.isEditing = false;
    renderTodos();
    // Returns focus to edit button
    setTimeout(
      () =>
        document
          .querySelector(
            `[data-id="${id}"] [data-testid="test-todo-edit-button"]`,
          )
          ?.focus(),
      0,
    );
  }

  if (e.target.dataset.testid === "test-todo-expand-toggle") {
    todo.isExpanded = !todo.isExpanded;
    renderTodos();
  }

  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter((t) => t.id != id);
    renderTodos();
  }
});

// Edit Form Submission
document.getElementById("todo-list").addEventListener("submit", (e) => {
  if (e.target.dataset.testid === "test-todo-edit-form") {
    e.preventDefault();
    const id = e.target.dataset.id;
    const todo = todos.find((t) => t.id == id);

    todo.title = e.target.querySelector(
      '[data-testid="test-todo-edit-title-input"]',
    ).value;
    todo.description = e.target.querySelector(
      '[data-testid="test-todo-edit-description-input"]',
    ).value;
    todo.priority = e.target.querySelector(
      '[data-testid="test-todo-edit-priority-select"]',
    ).value;
    todo.deadline = e.target.querySelector(
      '[data-testid="test-todo-edit-due-date-input"]',
    ).value;
    todo.status = e.target.querySelector(
      '[data-testid="test-todo-status-control"]',
    ).value;

    todo.completed = todo.status === "Done";
    todo.isEditing = false;
    renderTodos();
    // Accessibility: Return focus to edit button
    setTimeout(
      () =>
        document
          .querySelector(
            `[data-id="${id}"] [data-testid="test-todo-edit-button"]`,
          )
          ?.focus(),
      0,
    );
  }
});

// New Todo Submission
document.getElementById("todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  todos.push({
    id: Date.now(),
    title: document.getElementById("task-title").value,
    description: document.getElementById("task-desc").value,
    priority: document.getElementById("task-priority").value,
    deadline: document.getElementById("task-deadline").value,
    status: "Pending",
    completed: false,
    isEditing: false,
    isExpanded: false,
  });
  e.target.reset();
  renderTodos();
});

// Status Toggle Change
document.getElementById("todo-list").addEventListener("change", (e) => {
  if (e.target.dataset.testid === "test-todo-complete-toggle") {
    const id = e.target.closest(".todo-card").dataset.id;
    const todo = todos.find((t) => t.id == id);
    todo.completed = e.target.checked;
    todo.status = e.target.checked ? "Done" : "Pending";
    renderTodos();
  }
});

setInterval(renderTodos, 60000);
