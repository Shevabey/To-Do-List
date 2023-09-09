// SELECT ELEMENTS
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todoListEl = document.getElementById("todos-list");
const notifocationEl = document.querySelector(".notification");

//  VARS
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let EditTodoId = -1;

// 1st render
renderTodos();

// FORM SUBMIT
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // console.log('submit'); Tester Submit
  saveTodo();
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
});

// SAVE TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // CHECK IF THE TODO IS EMPTY
  const isEmpty = todoValue === "";

  //Check for duplicate todos
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );

  if (isEmpty) {
    showNotification("Todo's input is Empty");
  } else if (isDuplicate) {
    showNotification("Todo already exists");
  } else {
    // const todo = {
    //   value: todoValue,
    //   checked: false,
    //   color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Menambahkan Warna Acak utk list baru
    // };

    if (EditTodoId >= 0) {
      // updating the edit todo
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Menambahkan Warna Acak utk list baru
      });
    }

    todoInput.value = "";

    // console.log(todos); // tester sava todo
  }
}

// RENDER TODOS
function renderTodos() {
  if (todos.length === 0) {
    todoListEl.innerHTML = "<center>Noting to do!</center>";
    return;
  }

  //CLEAR ELEMENT BEFORE A RE-RENDER
  todoListEl.innerHTML = "";

  // RENDER TODOS
  todos.forEach((todo, index) => {
    todoListEl.innerHTML += `
    <div class="todo" id=${index}>
          <i 
            class="bi ${todo.checked ? `bi-check-circle-fill` : `bi-circle`}"
            style="color : ${todo.color}"
            data-action="check"
          ></i>
          <p class=" ${todo.checked ? `checked` : ``}" data-action="check">${
      todo.value
    }</p>
          <i class="bi bi-pencil-square" data-action="edit"></i>
          <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todoListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  //to do id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // TARGET ACTION
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);

  // console.log(todoId, action)
});

// CHECk A TODO
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
}

// EDIT A TODO
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;
  // re-render
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

// SHOW A NOTIFICATION
function showNotification(msg) {
  // change the message
  notifocationEl.innerHTML = msg;

  // notification enter
  notifocationEl.classList.add("notif-enter");

  //notification leave
  setTimeout(() => {
    notifocationEl.classList.remove("notif-enter");
  }, 2000);
}
