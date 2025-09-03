function updateTaskStatus() {
  const tasks = document.querySelectorAll(".task-status");

  tasks.forEach(statusDiv => {
    const dueDate = statusDiv.dataset.dueDate;
    const dueTime = statusDiv.dataset.dueTime;
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);

    const now = new Date();
    const diff = dueDateTime - now; // difference in ms

    if (diff > 0) {
      // calculate hours and minutes left
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      statusDiv.textContent = `Due in ${hours}h ${minutes}m`;
      statusDiv.style.color = "orange";
    } else {
      statusDiv.textContent = "Overdue!";
      statusDiv.style.color = "red";
    }
  });
}

// update every minute
updateTaskStatus();
setInterval(updateTaskStatus, 60000);
