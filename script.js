// Select elements
const taskName = document.getElementById("taskName");
const taskDeadline = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterTask = document.getElementById("filterTask");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const toggleTheme = document.getElementById("toggle-theme");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (filterTask.value === "completed") return task.completed;
    if (filterTask.value === "pending") return !task.completed;
    return true;
  }).filter(task => task.name.toLowerCase().includes(searchTask.value.toLowerCase()));

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <span>${task.name}</span>
        <span class="deadline">⏰ ${task.deadline || "No deadline"}</span>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">✏</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateProgress();
}

// Add task
addTaskBtn.addEventListener("click", () => {
  if (taskName.value.trim() === "") return alert("Enter a task!");
  tasks.push({
    name: taskName.value,
    deadline: taskDeadline.value,
    completed: false
  });
  taskName.value = "";
  taskDeadline.value = "";
  saveTasks();
  renderTasks();
});

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(index) {
  let newName = prompt("Edit task:", tasks[index].name);
  if (newName) tasks[index].name = newName;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update progress
function updateProgress() {
  let total = tasks.length;
  let completed = tasks.filter(t => t.completed).length;
  let percent = total ? Math.round((completed / total) * 100) : 0;
  progress.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

// Search & Filter
searchTask.addEventListener("input", renderTasks);
filterTask.addEventListener("change", renderTasks);

// Dark / Light mode toggle
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark") ? "☀" : "🌙";
});

// Initial render
renderTasks();
