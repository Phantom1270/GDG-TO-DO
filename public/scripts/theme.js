document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      toggleBtn.textContent = "☀️ Light Mode";
      localStorage.setItem("theme", "dark");
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
      localStorage.setItem("theme", "light");
    }
  });

  function attachCheckboxEvents() {
    const checkboxes = document.querySelectorAll(".task-checkbox");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const taskNameDiv = checkbox.parentElement.querySelector(".task-name");
        if (checkbox.checked) {
          taskNameDiv.classList.add("completed");
        } else {
          taskNameDiv.classList.remove("completed");
        }
      });

      // Apply initial completed state
      const taskNameDiv = checkbox.parentElement.querySelector(".task-name");
      if (checkbox.checked) {
        taskNameDiv.classList.add("completed");
      } else {
        taskNameDiv.classList.remove("completed");
      }
    });
  }

  // Make this function global so localStorageTasks.js can call it after rendering tasks
  window.attachCheckboxEvents = attachCheckboxEvents;

  // Initial call
  attachCheckboxEvents();
});
