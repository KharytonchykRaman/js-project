class ToDoList {
  constructor(array) {
    this.todos = array;
  }

  addToDo(newToDo) {
    this.todos.push(newToDo);
  }

  deleteToDoById(id) {
    const index = this.todos.findIndex(
      (item) => String(item.id) === String(id)
    );
    this.todos.splice(index, 1);
  }

  getToDoById(id) {
    return this.todos.find((item) => String(item.id) === String(id));
  }

  replaceToDoById(id, todo) {
    const index = this.todos.findIndex(
      (item) => String(item.id) === String(id)
    );
    this.todos[index] = todo;
  }
}

class TagList {
  constructor(array) {
    this.tags = array;
  }

  addTag(newTag) {
    this.tags.push(newTag);
  }

  isIncludesTag(tag) {
    return this.tags.includes(tag);
  }
}

const LOCAL_STORAGE_TODOLIST_KEY = "todo";
const LOCAL_STORAGE_TAGLIST_KEY = "tag";

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

function openCreateToDoModal() {
  createTodoModal.showModal();
}

function openEditToDoModal() {
  editTodoModal.showModal();
}

function closeCreateToDoModal() {
  createTodoModal.close();
}

function closeEditToDoModal() {
  editTodoModal.close();
}

function openCreateTagModal() {
  createtagModal.showModal();
}

function closeCreateTagModal() {
  createtagModal.close();
}

function clearTags() {
  createTodoModalDetails.innerHTML = "<summary>choose tags</summary>";
  editTodoModalDetails.innerHTML = "<summary>choose tags</summary>";
}

function renderTags() {
  clearTags();

  const tags = getTags();
  tags.forEach((tag) => {
    const summary = document.createElement("summary");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    summary.appendChild(document.createTextNode(tag));
    summary.appendChild(checkbox);

    const clonedSummary = summary.cloneNode(true);
    createTodoModalDetails.appendChild(summary);
    editTodoModalDetails.appendChild(clonedSummary);
  });
}

function getTagList() {
  if (localStorage.getItem(LOCAL_STORAGE_TAGLIST_KEY) === null) {
    const newTagList = new TagList([]);
    uploadTagListToLocalStorage(newTagList);
    return newTagList;
  }

  const tagList = new TagList(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAGLIST_KEY)).tags
  );
  return tagList;
}

function getTags() {
  return getTagList().tags;
}

function getToDoList() {
  if (localStorage.getItem(LOCAL_STORAGE_TODOLIST_KEY) === null) {
    const newToDoList = new ToDoList([]);
    uploadToDoListToLocalStorage(newToDoList);
    return newToDoList;
  }

  const toDoList = new ToDoList(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOLIST_KEY)).todos
  );
  return toDoList;
}

function getToDos() {
  return getToDoList().todos;
}

function uploadToDoListToLocalStorage(toDoList) {
  localStorage.setItem(LOCAL_STORAGE_TODOLIST_KEY, JSON.stringify(toDoList));
}

function uploadTagListToLocalStorage(tagList) {
  localStorage.setItem(LOCAL_STORAGE_TAGLIST_KEY, JSON.stringify(tagList));
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

function validateEditedToDo() {
  if (document.getElementById("editToDo-name").value.length < 1) {
    alert("empty name");
    return false;
  } else if (document.getElementById("editToDo-date").value.length < 1) {
    alert("empty date");
    return false;
  } else if (document.getElementById("editToDo-tags").value.length < 1) {
    alert("empty tags");
    return false;
  }

  const selectedDate = new Date(document.getElementById("editToDo-date").value);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("wrong deadline");
    return false;
  }

  return true;
}

function validateNewTag() {
  const tagList = getTagList();
  const newTag = document.getElementById("createTag-name").value;

  if (newTag.length < 1) {
    alert("empty name");
    return false;
  } else if (tagList.isIncludesTag(newTag)) {
    alert("tag already exists");
    return false;
  }
  return true;
}

function createNewTag() {
  if (validateNewTag()) {
    const tagName = document.getElementById("createTag-name").value;
    const tagList = getTagList();
    tagList.addTag(tagName);
    uploadTagListToLocalStorage(tagList);
    showCustomToast("Тег добавлен!");
    closeCreateTagModal();
    renderTags();
  }
}

function generateUniqueId() {
  return Date.now() - Math.floor(Math.random() * 1000);
}

function createNewToDo() {
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

  return newToDo;
}

function renderNewToDo() {
  if (validateNewToDo()) {
    let newToDo = createNewToDo();
    renderToDo(newToDo);

    const toDoList = getToDoList();
    toDoList.addToDo(newToDo);
    uploadToDoListToLocalStorage(toDoList);

    closeCreateToDoModal();
    showCustomToast("Задача добавлена!");
    logCheckedItems();
  }
}

function editToDo(id) {
  if (validateEditedToDo()) {
    const todo = getToDoList().getToDoById(id);

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
    todo.history.push({ action: "updated", timestamp: new Date() });

    const todoList = getToDoList();
    todoList.replaceToDoById(id, todo);
    uploadToDoListToLocalStorage(todoList);

    closeEditToDoModal();

    renderLocalStorageToDosArray();
  }
}

function initEditToDoModal(id) {
  const todo = getToDoList().getToDoById(id);

  openEditToDoModal();
  document.getElementById("editToDo-name").value = todo.title;
  document.getElementById("editToDo-description").value = todo.description;
  document.getElementById("editToDo-date").value = todo.deadline;
  document.getElementById("editToDo-tags").value = todo.tags;
  document.getElementById("editToDo-status").value = todo.status;
  document.getElementById("hidden-input-todoId").value = todo.id;
}

function deleteToDo(id) {
  const toDoList = getToDoList();
  toDoList.deleteToDoById(id);
  uploadToDoListToLocalStorage(toDoList);
}

function confirmDeleteToDo(id) {
  const confirmation = confirm("Вы уверены, что хотите удалить задачу?");
  if (confirmation) {
    deleteToDo(id);
    showCustomToast("Задача удалена!");
    renderLocalStorageToDosArray();
  }
}

function initToDoIntoTemplate(todo) {
  const item = template.content.cloneNode(true);

  item.querySelector(".todo-name").innerHTML = todo.title;
  item.querySelector(".todo-description").innerHTML = todo.description;
  item.querySelector(".todo-deadline").innerHTML = todo.deadline;
  item.querySelector(".todo-tags").innerHTML = todo.tags;
  item.querySelector(".todo-status").innerHTML = todo.status;
  item
    .querySelector(".delete-todo-button")
    .addEventListener("click", function () {
      confirmDeleteToDo(todo.id);
    });
  item
    .querySelector(".edit-todo-button")
    .addEventListener("click", function () {
      initEditToDoModal(todo.id);
    });

  return item;
}

function renderEditedToDo() {
  const id = editTodoModal.querySelector("#hidden-input-todoId").value;
  editToDo(id);
}

function renderToDo(todo) {
  const item = initToDoIntoTemplate(todo);
  todoContainer.append(item);
}

function clearToDoContainer() {
  todoContainer.innerHTML = "";
}

function renderLocalStorageToDosArray() {
  clearToDoContainer();

  const todosArray = getToDos();
  for (let i = 0; i < todosArray.length; i++) {
    renderToDo(todosArray[i]);
  }
}

function renderToDosArray(toDosArray) {
  clearToDoContainer();

  for (let i = 0; i < toDosArray.length; i++) {
    renderToDo(toDosArray[i]);
  }
}

function showCustomToast(message) {
  toastElement.textContent = message;

  toastElement.classList.remove("hidden");

  setTimeout(() => {
    toastElement.classList.add("hidden");
  }, 3000);
}

const createTodoButton = document.getElementById("createTodo-button");
const cancelCreateToDoButton = document.getElementById("closeModal");
const acceptCreateToDoButton = document.getElementById("acceptCreation");

const createTagButton = document.getElementById("createTag-button");
const cancelCreateTagButton = document.getElementById("closeCreateTagModal");
const acceptCreateTagButton = document.getElementById("acceptCreateTagModal");

const cancelEditButton = document.getElementById("closeEditModal");
const acceptEditButton = document.getElementById("acceptEdit");

const createTodoModal = document.getElementById("createTodo-dialog");
const editTodoModal = document.getElementById("editTodo-dialog");
const createtagModal = document.getElementById("createTag-dialog");

const toastElement = document.getElementById("toast");

const todoContainer = document.getElementById("todo-container");

const template = document.getElementById("template");

createTodoButton.addEventListener("click", openCreateToDoModal);

cancelCreateToDoButton.addEventListener("click", closeCreateToDoModal);
acceptCreateToDoButton.addEventListener("click", renderNewToDo);

cancelEditButton.addEventListener("click", closeEditToDoModal);

acceptEditButton.addEventListener("click", renderEditedToDo);

createTagButton.addEventListener("click", openCreateTagModal);
cancelCreateTagButton.addEventListener("click", closeCreateTagModal);
acceptCreateTagButton.addEventListener("click", createNewTag);

const createTodoModalDetails = createTodoModal.querySelector("details");
const editTodoModalDetails = editTodoModal.querySelector("details");

renderLocalStorageToDosArray();
renderTags();

function logCheckedItems() {
  const checkboxes = createTodoModal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
          console.log(checkbox.previousElementSibling.value);
      }
  });
}