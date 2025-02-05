class ToDoList {
  constructor(array) {
    this.todos = array;
  }

  addToDo(newToDo) {
    this.todos.push(newToDo);
  }

  deleteToDoById(toDoId) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === toDoId) {
        this.todos.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getToDoById(toDoId){
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === toDoId) {
        return this.todos[i];
      }
    }
    return false;
  }

  replaceToDoById(id, todo){
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1, todo);
      }
    }
  }
}

const LOCAL_STORAGE_KEY = "key";

async function fetchDataWeather() {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=1ea453f5501c528eb93b8765879e5373"
  );
  const data = await response.json();
  return data;
}

async function fetchDataCurrency() {
  const response = await fetch("https://api.nbrb.by/exrates/rates/431");
  const data = await response.json();
  return data;
}

async function getTemperature() {
  const data = await fetchDataWeather();
  let temp = `${(data.main.temp - 273).toFixed(1)} °C`;
  return temp;
}

async function getCurrency() {
  const data = await fetchDataCurrency();
  let curr = `${data.Cur_OfficialRate.toFixed(2)} BYN`;
  return curr;
}

async function inputTemperature() {
  let temperature = await getTemperature();
  const tempDiv = document.getElementById("weather");
  tempDiv.append(temperature);
}

async function inputCurrency() {
  let currency = await getCurrency();
  const currDiv = document.getElementById("currency");
  currDiv.append(currency);
}

inputTemperature();
inputCurrency();

function openModalWindow() {
  creationTodoWindow.showModal();
}

function openEditModalWindow() {
  editTodoWindow.showModal();
}

function confirmEdit(id){
  const todo = getElementById(id);

    const title = document.getElementById("editToDo-name").value;
    const description = document.getElementById("editToDo-description").value;
    const deadline = document.getElementById("editToDo-date").value;
    const tags = document.getElementById("editToDo-tags").value;
    const status = document.getElementById("editToDo-status").value;

    todo.title = title;
    todo.description = description;
    todo.deadline = deadline;
    todo.tags = tags;
    todo.status = status;
    todo.updatedAt = new Date();
    todo.history.push({action:"updated", timestamp: updatedAt})
    const todoList = getToDoList();
    todoList.replaceToDoById(id,todo);
    closeEditModalWindow();
}

function closeCreationModalWindow() {
  creationTodoWindow.close();
}

function closeEditModalWindow() {
  editTodoWindow.close();
}

function validateNewToDo() {
  if (document.getElementById("newToDo-name").value.length < 1) {
    alert("empty name");
    return false;
  } else if (document.getElementById("newToDo-date").value.length < 1) {
    alert("empty date");
    return false;
  } else if (document.getElementById("newToDo-tags").value.length < 1) {
    alert("empty tags");
    return false;
  }

  const selectedDate = new Date(document.getElementById("newToDo-date").value);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("wrong deadline");
    return false;
  }

  return true;
}

function generateUniqueId() {
  return Date.now() - Math.floor(Math.random() * 1000);
}

function getToDoList(){
  if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
    const newToDoList = new ToDoList([]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newToDoList));
    return newToDoList;
  }

  const toDoList = new ToDoList(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).todos);
  return toDoList;
}

function getToDos(){
  return getToDoList().todos;
}

function createNewToDo() {
  if (validateNewToDo()) {
    const id = generateUniqueId();
    const title = document.getElementById("newToDo-name").value;
    const description = document.getElementById("newToDo-description").value;
    const deadline = document.getElementById("newToDo-date").value;
    const tags = document.getElementById("newToDo-tags").value;
    const status = document.getElementById("newToDo-status").value;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const history = [{ action: "created", timestamp: createdAt }];

    let newToDo = {
      id: id,
      title: title,
      description: description,
      deadline: deadline,
      tags: tags,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
      history: history,
    };
    const toDoList = getToDoList();
    toDoList.addToDo(newToDo);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDoList));
    closeCreationModalWindow();
    renderToDo(newToDo);
    showCustomToast("Задача добавлена!");
  }
}


function editToDo(id) {
  const todo = getToDoList().getToDoById(id);

  openEditModalWindow();
  document.getElementById("editToDo-name").value = todo.title;
  document.getElementById("editToDo-description").value = todo.description;
  document.getElementById("editToDo-date").value = todo.deadline;
  document.getElementById("editToDo-tags").value = todo.tags;
  document.getElementById("editToDo-status").value = todo.status;
  acceptEditButton.addEventListener("click", function(){confirmEdit(id); renderToDosArray();})
}

function deleteToDo(id) {
    const toDoList = getToDoList();
    toDoList.deleteToDoById(id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDoList));
}

function confirmDeleteToDo(id){
  let confirmation = confirm("Вы уверены, что хотите удалить задачу?");
  if (confirmation) {
    deleteToDo(id);
    showCustomToast("Задача удалена!")
  }
}

function initToDo(todo) {
  const template = document.getElementById("template");
  const item = template.content.cloneNode(true);
  item.querySelector(".todo-name").innerHTML = todo.title;
  item.querySelector(".todo-description").innerHTML = todo.description;
  item.querySelector(".todo-deadline").innerHTML = todo.deadline;
  item.querySelector(".todo-tags").innerHTML = todo.tags;
  item.querySelector(".todo-status").innerHTML = todo.status;
  const deleteButton = item.querySelector(".delete-todo");
  const editButton = item.querySelector(".edit-todo");
  deleteButton.addEventListener("click",function(){confirmDeleteToDo(todo.id);  renderToDosArray();} );
  editButton.addEventListener("click",function(){editToDo(todo.id);  renderToDosArray();} );
  return item;
}

function renderToDo(todo) {
  const item = initToDo(todo);
  const todoContainer = document.getElementById("todo-container");
  todoContainer.append(item);
}

function clearToDoContainer(){
  const todoContainer = document.getElementById("todo-container");
  todoContainer.innerHTML = '';
}

function renderToDosArray() {
  clearToDoContainer();
  const todosArray = getToDos();
  for (let i = 0; i < todosArray.length; i++) {
    renderToDo(todosArray[i]);
  }
}

function showCustomToast(message) {
  toastElement.textContent = message;

  toastElement.classList.remove('hidden');

  setTimeout(() => {
    toastElement.classList.add('hidden');
  }, 3000); 
}

const createTodoButton = document.getElementById("createTodo-button");
const cancelCreationButton = document.getElementById("closeModal");
const acceptCreationButton = document.getElementById("acceptCreation");

const cancelEditButton = document.getElementById("closeEditModal");
const acceptEditButton = document.getElementById("acceptEdit");

const creationTodoWindow = document.getElementById("createTodo-dialog");
const editTodoWindow = document.getElementById("editTodo-dialog");

const toastElement = document.getElementById('toast');

createTodoButton.addEventListener("click", openModalWindow);
cancelCreationButton.addEventListener("click", closeCreationModalWindow);
acceptCreationButton.addEventListener("click", createNewToDo);

cancelEditButton.addEventListener("click", closeEditModalWindow);

renderToDosArray();