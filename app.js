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

function renderTagsIntoModals() {
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

function createTagsDropdownUl() {
  const ul = document.createElement('ul');

  const tags = getTags();

  tags.forEach(tag => {
    const li = document.createElement('li')
    li.innerHTML = String(tag);
    ul.appent(li);
})
  return ul;
}

function renderTagsDropdownUlIntoElem(elem){
  const ul = createTagsDropdownUl();

  elem.append(ul);
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

function isNameValid(name) {
  return name.trim().length > 0;
}

function isDateValid(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !isNaN(selectedDate) && selectedDate >= today;
}

function areTagsValid(tags) {
  return tags.length > 0;
}

function doesTagExist(tagList, tag) {
  return !tagList.isIncludesTag(tag);
}

function validateNewToDo() {
  const name = document.getElementById("newToDo-name").value;
  const date = document.getElementById("newToDo-date").value;
  const tags = getCheckedTags(createTodoModal);

  if (!isNameValid(name)) {
    alert("empty name");
    return false;
  }

  if (!isDateValid(date)) {
    alert("wrong deadline");
    return false;
  }

  if (!areTagsValid(tags)) {
    alert("empty tags");
    return false;
  }

  return true;
}

function validateNewTag() {
  const tagList = getTagList();
  const newTag = document.getElementById("createTag-name").value;

  if (!isNameValid(newTag)) {
    alert("empty name");
    return false;
  }

  if (!doesTagExist(tagList, newTag)) {
    alert("tag already exists");
    return false;
  }

  return true;
}

function validateEditedToDo() {
  const name = document.getElementById("editToDo-name").value;
  const date = document.getElementById("editToDo-date").value;
  const tags = getCheckedTags(editTodoModal);

  if (!isNameValid(name)) {
    alert("empty name");
    return false;
  }

  if (!isDateValid(date)) {
    alert("wrong deadline");
    return false;
  }

  if (!areTagsValid(tags)) {
    alert("empty tags");
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
    renderTagsIntoModals();
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
  const tags = getCheckedTags(createTodoModal);
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
  }
}

function editToDo(id) {
  if (validateEditedToDo()) {
    const todo = getToDoList().getToDoById(id);

    const title = document.getElementById("editToDo-name").value;
    const description = document.getElementById("editToDo-description").value;
    const deadline = document.getElementById("editToDo-date").value;
    const tags = getCheckedTags(editTodoModal);
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
    showCustomToast("Задача обновлена!");
  }
}

function chooseCheckboxesEditModal(todo) {
  const details = editTodoModal.querySelector("details");
  const checkboxes = details.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    if (todo.tags.includes(checkbox.value)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  });
}

function initEditToDoModal(id) {
  const todo = getToDoList().getToDoById(id);

  openEditToDoModal();

  document.getElementById("editToDo-name").value = todo.title;
  document.getElementById("editToDo-description").value = todo.description;
  document.getElementById("editToDo-date").value = todo.deadline;
  document.getElementById("editToDo-status").value = todo.status;
  document.getElementById("hidden-input-todoId").value = todo.id;

  chooseCheckboxesEditModal(todo);
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

const createModalDropdownButton = document.getElementById("create-modal-dropdown-button");
const createModalDropdown = document.getElementById('create-modal-tags-dropdown');

createModalDropdownButton.addEventListener('click', ()=> {
  renderTagsDropdownUlIntoElem(createModalDropdown);
})

renderLocalStorageToDosArray();
renderTagsIntoModals();

function getCheckedTags(modalWindow) {
  let checkboxes = modalWindow.querySelectorAll('input[type="checkbox"]');
  let checkedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  let parentTexts = checkedCheckboxes.map((checkbox) =>
    checkbox.parentElement.textContent.trim()
  );
  return parentTexts;
}

const sortButton = document.getElementById("sort-dropdown-button");
const sortOptionsList = document.getElementById("sort-options-list");

sortButton.addEventListener("click", (event) => {
  event.stopPropagation()
  sortOptionsList.style.display =
    sortOptionsList.style.display === "block" ? "none" : "block";
});

sortOptionsList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const selectedValue = event.target.getAttribute("data-value");
    const selectedText = event.target.textContent;

    sortButton.innerHTML = `<img src="icons8-sort-100.png" alt="" class="icon"> ${selectedText}`;

    sortOptionsList.style.display = "none";

    renderSortedTodos(selectedValue);
  }
});

document.addEventListener("click", (event) => {
  if (sortOptionsList.style.display === "block" && !sortOptionsList.contains(event.target) && !sortButton.contains(event.target)) {
    sortOptionsList.style.display = "none";
  }
});

function renderSortedTodos(selectedValue) {
  let resultArray = [];
  if (selectedValue === "createDate") {
    resultArray = sortTodosByDate();
  } else if (selectedValue === "name") {
    resultArray = sortTodosByName();
  } else {
    resultArray = sortTodosByPriority();
  }

  renderToDosArray(resultArray);
}

function sortTodosByDate() {
  const todos = getToDos();

  todos.sort(
    (todo1, todo2) => new Date(todo1.createdAt) - new Date(todo2.createdAt)
  );

  return todos;
}

function sortTodosByName() {
  const todos = getToDos();

  todos.sort((todo1, todo2) =>
    todo1.title.localeCompare(todo2.title, undefined, { sensitivity: "base" })
  );

  return todos;
}

function sortTodosByPriority() {
  const todos = getToDos();

  return todos;
}

const filterButton = document.getElementById("filter-dropdown-button");
const filterOptionsList = document.getElementById("filter-options-list");

filterButton.addEventListener("click", (event) => {
  event.stopPropagation()
  filterOptionsList.style.display =
    filterOptionsList.style.display === "block" ? "none" : "block";
});

filterOptionsList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const selectedValue = event.target.getAttribute("data-value");
    const selectedText = event.target.textContent;

    filterButton.innerHTML = `<img src="icons8-filter-100.png" alt="" class="icon"> ${selectedText}`;

    filterOptionsList.style.display = "none";
  }
});

const statusDropdownButton = document.getElementById("status-dropdown-button");
const statusDropdown = document.getElementById("filter-status-options");


statusDropdownButton.addEventListener('click',() => {
  statusDropdown.style.display =
  statusDropdown.style.display === "block" ? "none" : "block";
})


/* <style>
        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }

        .dropdown-content label {
            padding: 12px 16px;
            display: block;
            cursor: pointer;
        }

        .dropdown-content label:hover {
            background-color: #f1f1f1;
        }
    </style>
</head>
<body>

<div class="dropdown">
    <button class="dropbtn">Выбрать пункты</button>
    <div class="dropdown-content" id="dropdown-content">
        <!-- Элементы будут добавлены здесь -->
    </div>
</div>

<script>
    const items = ["Пункт 1", "Пункт 2", "Пункт 3", "Пункт 4"]; // Ваш массив строк
    const dropdownContent = document.getElementById('dropdown-content');

    items.forEach((item, index) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `option${index + 1}`;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        dropdownContent.appendChild(label);
    });

    const checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedValues = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    selectedValues.push(cb.value);
                }
            });
            console.log('Выбранные значения:', selectedValues);
        });
    });
</script>*/