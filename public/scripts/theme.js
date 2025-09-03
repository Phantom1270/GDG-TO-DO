document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;
  const checkboxes = document.querySelectorAll(".task-checkbox");

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

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const index = checkbox.dataset.index;

      fetch(`/toggle-done/${index}`, { method: "POST" });
      
      if (checkbox.checked) {
        checkbox.parentElement.querySelector(".task-name").style.textDecoration = "line-through";
      } else {
        checkbox.parentElement.querySelector(".task-name").style.textDecoration = "none";
      }
    });
});
checkboxes.forEach((checkbox) => {
  const taskName = checkbox.parentElement.querySelector(".task-name");
  if (checkbox.checked) {
    taskName.classList.add("completed");
  }
});

});
