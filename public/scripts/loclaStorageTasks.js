document.addEventListener("DOMContentLoaded", () => {
  const todoGrid = document.querySelector(".todo-grid");
  const filterSelect = document.getElementById("filter");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Load saved filter from localStorage
  const savedSort = localStorage.getItem("sortType");
  if (savedSort) {
    filterSelect.value = savedSort;
  }

  function renderTasks() {
    todoGrid.innerHTML = "";

    const sortType = filterSelect.value;

    // Save the current sort type
    localStorage.setItem("sortType", sortType);

    // Make a sorted copy
    let sortedTasks = [...tasks];

    if (sortType === "time") {
      const now = new Date();
      sortedTasks.sort((a, b) => {
        if (a.done && !b.done) return 1;
        if (!a.done && b.done) return -1;

        const aDate = new Date(`${a.dueDate}T${a.dueTime}`);
        const bDate = new Date(`${b.dueDate}T${b.dueTime}`);

        if (aDate < now && bDate >= now) return -1;
        if (bDate < now && aDate >= now) return 1;

        return aDate - bDate;
      });
    } else if (sortType === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      sortedTasks.sort((a, b) => {
        if (a.done && !b.done) return 1;
        if (!a.done && b.done) return -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    // Render sorted tasks
    sortedTasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "todo-item";
      div.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.done ? "checked" : ""} data-index="${index}">
        <div class="task-name">${task.taskName}</div>
        <div class="task-date">${task.dueDate}</div>
        <div class="task-status" data-due-date="${task.dueDate}" data-due-time="${task.dueTime}">Loading...</div>
        <div class="task-priority ${task.priority.toLowerCase()}">${task.priority}</div>
        <button class="delete-todo-button" data-index="${index}">Delete</button>
      `;
      todoGrid.appendChild(div);
    });

    updateTaskStatus(); // your existing time.js function
    attachEvents();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function attachEvents() {
    document.querySelectorAll(".task-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        const i = cb.dataset.index;
        tasks[i].done = cb.checked;
        saveTasks();
        renderTasks();
      });
    });

    document.querySelectorAll(".delete-todo-button").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        tasks.splice(i, 1);
        saveTasks();
        renderTasks();
      });
    });
  }

  // Hook add task form
  const addForm = document.querySelector(".form-container");
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    const taskName = addForm.taskName.value;
    const dueDate = addForm.dueDate.value;
    const dueTime = addForm.dueTime.value;
    const priority = addForm.priority.value;

    if (!taskName || !dueDate || !dueTime) return;

    tasks.push({ taskName, dueDate, dueTime, priority, done: false });
    saveTasks();
    renderTasks();

    addForm.reset();
  });

  // Re-render tasks when filter changes
  filterSelect.addEventListener("change", renderTasks);

  renderTasks();
});
