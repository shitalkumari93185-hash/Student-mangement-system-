const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(
    localStorage.getItem("studentTasks") || "[]"
);

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));}

function addTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        date: taskDate.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();

    taskInput.value = "";
    taskDate.value = "";

    renderTasks();
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    const confirmed = confirm("Delete this task?");

    if (!confirmed) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    totalCount.textContent = tasks.length;
    pendingCount.textContent =
        tasks.filter(task => !task.completed).length;
    completedCount.textContent =
        tasks.filter(task => task.completed).length;

    emptyMessage.hidden = visibleTasks.length > 0;

    if (visibleTasks.length === 0) {
        emptyMessage.textContent =
            tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks found in this category.";
    }

    visibleTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label", "Mark task as completed"
        );

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        info.appendChild(title);

        if (task.date) {
            const date = document.createElement("p");
            date.textContent = "Due: " + task.date;
            info.appendChild(date);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute(
            "aria-label", "Delete " + task.title
        );

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(checkbox, info, deleteBtn);
        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

filters.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filters.forEach(filter => {
            filter.classList.toggle(
                "active", filter === button
            );
        });

        renderTasks();
    });
});

renderTasks();
