// Toggle Themes

let toggleBtn = document.querySelector(".toggletheme");
let themeImg = document.querySelector(".toggletheme img");

let theme = localStorage.getItem("theme");

if (theme === "dark") {
  document.body.classList.add("darktheme");
  themeImg.dataset.theme = "dark";
  themeImg.src = "images/sun.png";
}

function toggleTheme() {
  document.body.classList.toggle("darktheme");
  if (themeImg.dataset.theme === "light") {
    themeImg.dataset.theme = "dark";
    themeImg.src = "images/sun.png";
    localStorage.theme = "dark";
  } else {
    themeImg.dataset.theme = "light";
    themeImg.src = "images/moon.png";
    localStorage.theme = "light";
  }
}

toggleBtn.addEventListener("click", toggleTheme);

// To Do List

let taskInput = document.getElementById("addtask");
let addBtn = document.querySelector(".add");
let boxes = document.querySelectorAll(".box");
let box = document.querySelectorAll(".box")[0];
let boxContent = box.querySelector(".box-content");
let allTasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];
console.log("all tasks", allTasks);

const getData = () => {
  if (allTasks.length > 0) {
    const nullStatus = allTasks.filter((t) => t.status === null);
    const pendingStatus = allTasks.filter((t) => t.status === "pending");
    const completeStatus = allTasks.filter((t) => t.status === "complete");
    console.log("nullStatus", nullStatus);
    console.log("pendingStatus", pendingStatus);
    console.log("completeStatus", completeStatus);
    boxes.forEach((box) => {
      if (box.dataset.status === "") {
        if (nullStatus.length > 0) {
          nullStatus.forEach(
            (task) =>
              (box.innerHTML += `
                  <div class='task' draggable="true">
                  <p class='text'>${task.task}</p>
                  <button class='delete' >delete</button>
                  </div>
              `)
          );
        }
      } else if (box.dataset.status === "pending") {
        if (pendingStatus.length > 0) {
          pendingStatus.forEach(
            (task) =>
              (box.innerHTML += `
                  <div class='task' draggable="true">
                  <p class='text'>${task.task}</p>
                  <button class='delete' >delete</button>
                  </div>
              `)
          );
        }
      } else if (box.dataset.status === "complete") {
        if (completeStatus.length > 0) {
          completeStatus.forEach(
            (task) =>
              (box.innerHTML += `
                  <div class='task' draggable="true">
                  <p class='text'>${task.task}</p>
                  <button class='delete' >delete</button>
                  </div>
              `)
          );
        }
      }
    });
  }
};
// getData();
// Add Task to the box
addBtn.addEventListener("click", () => {
  let taskValue = taskInput.value;
  if (taskValue === "") {
    alert("enter the value");
  } else {
    boxContent.innerHTML += `
    <div class='task' draggable="true">
    <p class='text'>${taskValue}</p>
    <button class='delete' >delete</button>
    </div>
    `;
    taskInput.value = "";
    allTasks.push({
      id: Date.now(),
      task: taskValue,
      status: null,
    });
    taskInput.focus();
    localStorage.tasks = JSON.stringify(allTasks);
  }

  drageTask();
  deleteTask();
});

// Drag Task

function drageTask() {
  let tasks = document.querySelectorAll(".task");
  let currentDrag = null;
  tasks.forEach((task) => {
    // Start Draging
    task.addEventListener("dragstart", () => {
      task.style.backgroundColor = "#c1c1c1";
      currentDrag = task;
    });

    // End Draging
    task.addEventListener("dragend", () => {
      task.style.backgroundColor = "#fff";
      console.log(task);

      currentDrag = null;
    });

    boxes.forEach((box) => {
      // Drag Over
      box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.style.backgroundColor = "green";
      });

      // Drag Leave
      box.addEventListener("dragleave", () => {
        box.style.backgroundColor = "var(--box-bg-color)";
      });

      // Drop
      box.addEventListener("drop", () => {
        box.appendChild(currentDrag);
        box.style.backgroundColor = "var(--box-bg-color)";
        const task = allTasks.find(
          (t) => t.task === currentDrag.firstElementChild.textContent
        );

        if (task) {
          task.status = box.dataset.status;
        }

        localStorage.setItem("tasks", JSON.stringify(allTasks));
      });
    });
  });
}

function deleteTask() {
  let deleteBtn = document.querySelectorAll(".delete");

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.remove();
      allTasks = allTasks.filter(
        (t) => t.task !== btn.parentElement.childNodes[1].textContent
      );
      localStorage.setItem("tasks", JSON.stringify(allTasks));
    });
  });
}

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});
