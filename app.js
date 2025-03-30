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

const MAX_NAME_LENGTH = 25;
const MAX_TODODESC_LENGTH = 300;

const tempDiv = document.getElementById("weather");
const currDiv = document.getElementById("currency");

const newToDoName = document.getElementById("newToDo-name");
const newToDoDate = document.getElementById("newToDo-deadline");
const newToDoDesc = document.getElementById("newToDo-description");
const newToDoStatus = document.getElementById("newToDo-status");

const newToDoLongNameErr = document.getElementById("newToDo-long-name-error");
const newToDoEmptyNameErr = document.getElementById("newToDo-empty-name-error");
const newToDoDateErr = document.getElementById("newToDo-date-error");
const newToDoDescErr = document.getElementById("newToDo-desc-error");
const newToDoTagsErr = document.getElementById("newToDo-tags-error");

newToDoName.addEventListener('input', () => {
  hideElements(newToDoEmptyNameErr);
  if (newToDoName.value.length > MAX_NAME_LENGTH) {
    newToDoName.value = newToDoName.value.slice(0, MAX_NAME_LENGTH);
    newToDoLongNameErr.style.display = 'block';
  } else {
    hideElements(newToDoLongNameErr);
  }
});

newToDoDesc.addEventListener('input', () => {
  if (newToDoDesc.value.length > 300) {
    newToDoDesc.value = newToDoDesc.value.slice(0, 300);
    newToDoDescErr.style.display = 'block';
  } else {
    hideElements(newToDoDescErr);
  }
});

newToDoDate.addEventListener('input', () => {
  hideElements(newToDoDateErr);
});

const newTagName = document.getElementById("createTag-name");
const newTagEmptyNameErr = document.getElementById("newTag-empty-name-error");
const newTagExistingNameErr = document.getElementById("newTag-existing-name-error");
const newTagLongNameErr = document.getElementById("newTag-long-name-error");

newTagName.addEventListener('input', () => {
  if (newTagName.value.length > MAX_NAME_LENGTH) {
    newTagName.value = newTagName.value.slice(0, MAX_NAME_LENGTH);
    newTagLongNameErr.style.display = 'block';
  } else {
    hideElements(newTagLongNameErr);
  }
});

const editTodoName = document.getElementById("editToDo-name");
const editTodoDate = document.getElementById("editToDo-deadline");
const editTodoDesc = document.getElementById("editToDo-description");
const editTodoStatus = document.getElementById("editToDo-status");

const editToDoLongNameErr = document.getElementById("editToDo-long-name-error");
const editToDoEmptyNameErr = document.getElementById("editToDo-empty-name-error");
const editToDoDateErr = document.getElementById("editToDo-date-error");
const editToDoDescErr = document.getElementById("editToDo-desc-error");
const editToDoTagsErr = document.getElementById("editToDo-tags-error");

editTodoName.addEventListener('input', () => {
  hideElements(editToDoEmptyNameErr);
  if (editTodoName.value.length > MAX_NAME_LENGTH) {
    editTodoName.value = editTodoName.value.slice(0, MAX_NAME_LENGTH);
    editToDoLongNameErr.style.display = 'block';
  } else {
    hideElements(editToDoLongNameErr);
  }
});

editTodoDesc.addEventListener('input', () => {
  if (editTodoDesc.value.length > 300) {
    editTodoDesc.value = editTodoDesc.value.slice(0, 300);
    editToDoDescErr.style.display = 'block';
  } else {
    hideElements(editToDoDescErr);
  }
});

editTodoDate.addEventListener('input', () => {
  hideElements(editToDoDateErr);
});

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
const createTagModal = document.getElementById("createTag-dialog");

const toastElement = document.getElementById("toast");

const todoContainer = document.getElementById("todo-container");

const template = document.getElementById("template");

const sortButton = document.getElementById("sort-dropdown-button");
const sortOptionsList = document.getElementById("sort-dropdown-content");

const createModalDropdownButton = document.getElementById(
  "create-modal-tags-dropdown-button"
);
const createModalDropdownContent = document.getElementById(
  "create-modal-tags-dropdown-content"
);
const createModalDropdownHide = document.getElementById(
  "create-modal-tags-dropdown-hide-button"
);

createModalDropdownHide.addEventListener("click", () => {
  hideElements(createModalDropdownContent);
});
createModalDropdownButton.addEventListener("click", () => {
  switchDisplay(createModalDropdownContent);
  hideElements(newToDoTagsErr);
});

const editModalDropdownButton = document.getElementById(
  "edit-modal-tags-dropdown-button"
);
const editModalDropdownContent = document.getElementById(
  "edit-modal-tags-dropdown-content"
);
const editModalDropdownHide = document.getElementById(
  "edit-modal-tags-dropdown-hide-button"
);

editModalDropdownHide.addEventListener("click", () => {
  hideElements(editModalDropdownContent);
});
editModalDropdownButton.addEventListener("click", () => {
  switchDisplay(editModalDropdownContent);
});

createTodoButton.addEventListener("click", openCreateToDoModal);

cancelCreateToDoButton.addEventListener("click", closeCreateToDoModal);
acceptCreateToDoButton.addEventListener("click",()=>{renderNewToDo(); hideElements(newToDoLongNameErr,newToDoDescErr)} );

cancelEditButton.addEventListener("click", closeEditToDoModal);

acceptEditButton.addEventListener("click", renderEditedToDo);

createTagButton.addEventListener("click", openCreateTagModal);
cancelCreateTagButton.addEventListener("click", closeCreateTagModal);
acceptCreateTagButton.addEventListener("click",()=>{createNewTag(); hideElements(newTagLongNameErr)} );

sortButton.addEventListener("click", (event) => {
  switchDisplay(sortOptionsList);
});

sortOptionsList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const selectedValue = event.target.getAttribute("data-value");
    const selectedText = event.target.textContent;
    sortButton.innerHTML = `<img src="icons8-sort-100.png" alt="" class="icon"> ${selectedText}`;
    sortOptionsList.style.display = "none";

    const filteredTodos = filterTodos();
    renderSortedTodos(selectedValue, filteredTodos);
  }
});

document.addEventListener("click", (event) => {
  if (
    sortOptionsList.style.display === "block" &&
    !sortOptionsList.contains(event.target) &&
    !sortButton.contains(event.target)
  ) {
    sortOptionsList.style.display = "none";
  }

  if (
    filterDropdownContent.style.display === "block" &&
    !filterDropdownContent.contains(event.target) &&
    !filterButton.contains(event.target)
  ) {
    filterDropdownContent.style.display = "none";
  }
});

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
  tempDiv.append(temperature);
}

async function inputCurrency() {
  let currency = await getCurrency();
  currDiv.append(currency);
}

function openCreateToDoModal() {
  clearEl(createModalDropdownContent);
  renderTagsDropdown(createModalDropdownContent);
  createTodoModal.showModal();
}

function openEditToDoModal() {
  clearEl(editModalDropdownContent);
  renderTagsDropdown(editModalDropdownContent);
  editTodoModal.showModal();
}

function closeCreateToDoModal() {
  createTodoModal.close();
  hideElements(newToDoLongNameErr,newToDoDescErr);
}

function closeEditToDoModal() {
  editTodoModal.close();
}

function openCreateTagModal() {
  createTagModal.showModal();
}

function closeCreateTagModal() {
  createTagModal.close();
  hideElements(newTagLongNameErr);
}

function renderTagsDropdown(parentEl) {
  const tags = getTags();

  tags.forEach((tag) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(tag));
    parentEl.appendChild(li);

    li.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    });
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

function isNameValid(name) {
  return name.trim().length > 0 && name.trim().length < MAX_NAME_LENGTH;
}

function isDescriptionValid(desc) {
  return desc.trim().length < MAX_TODODESC_LENGTH;
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

function doesTagExist(tag) {
  const tagList = getTagList();
  return !tagList.isIncludesTag(tag);
}

function validateNewToDo() {
  const name = newToDoName.value;
  const date = newToDoDate.value;
  const desc = newToDoDesc.value;
  const tags = getCheckedTags(createTodoModal);

  if (!isNameValid(name)) {
    newToDoEmptyNameErr.style.display = "block";
    return false;
  }
  if (!isDateValid(date)) {
    newToDoDateErr.style.display = "block";
    return false;
  }
  if (!areTagsValid(tags)) {
    newToDoTagsErr.style.display = "block";
    return false;
  }
  return true;
}

function validateNewTag() {
  const newTag = newTagName.value;

  if (!isNameValid(newTag)) {
    newTagEmptyNameErr.style.display = "block";
    return false;
  }

  if (!doesTagExist(newTag)) {
    newTagExistingNameErr.style.display = "block";
    return false;
  }

  return true;
}

function validateEditedToDo() {
  const name = editTodoName.value;
  const date = editTodoDate.value;
  const tags = getCheckedTags(editTodoModal);
  const desc = editTodoDesc.value;

  if (!isNameValid(name)) {
    editToDoEmptyNameErr.style.display = "block";
    return false;
  }

  if (!isDateValid(date)) {
    editToDoDateErr.style.display = "block";
    return false;
  }

  if (!areTagsValid(tags)) {
    editToDoTagsErr.style.display = "block";
    return false;
  }

  return true;
}

function createNewTag() {
  if (validateNewTag()) {
    const tagName = newTagName.value;
    const tagList = getTagList();
    tagList.addTag(tagName);
    uploadTagListToLocalStorage(tagList);
    showCustomToast("Тег добавлен!");
    closeCreateTagModal();
  }
}

function generateUniqueId() {
  return Date.now() - Math.floor(Math.random() * 1000);
}

function createNewToDo() {
  let newToDo = {
    id: generateUniqueId(),
    title: newToDoName.value,
    description: newToDoDesc.value,
    deadline: newToDoDate.value,
    tags: getCheckedTags(createTodoModal),
    status: newToDoStatus.value,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [{ action: "created", timestamp: new Date() }],
  };

  return newToDo;
}

function renderNewToDo() {
  if (validateNewToDo()) {
    let newToDo = createNewToDo();

    const toDoList = getToDoList();
    toDoList.addToDo(newToDo);
    uploadToDoListToLocalStorage(toDoList);

    renderLocalStorageToDosArray();

    closeCreateToDoModal();
    showCustomToast("Задача добавлена!");
  }
}

function editToDo(id) {
  if (validateEditedToDo()) {
    const todo = getToDoList().getToDoById(id);

    todo.title = editTodoName.value;
    todo.description = editTodoDesc.value;
    todo.deadline = editTodoDate.value;
    todo.tags = getCheckedTags(editTodoModal);
    todo.status = editTodoStatus.value;
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
  const checkboxes = editModalDropdownContent.querySelectorAll(
    'input[type="checkbox"]'
  );

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

  editTodoName.value = todo.title;
  editTodoDesc.value = todo.description;
  editTodoDate.value = todo.deadline;
  editTodoStatus.value = todo.status;
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

function clearEl(el) {
  el.innerHTML = "";
}

function renderLocalStorageToDosArray() {
  const todosArray = getToDos();

  renderToDosArray(todosArray);
}

function renderToDosArray(toDosArray) {
  clearEl(todoContainer);

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

function getCheckedTags(modalWindow) {
  let checkboxes = modalWindow.querySelectorAll('input[type="checkbox"]');
  let checkedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  let checkedTags = checkedCheckboxes.map((checkbox) => checkbox.value);
  return checkedTags;
}

function switchDisplay(el) {
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function renderSortedTodos(selectedValue, todos) {
  let sortedTodos;

  if (selectedValue === "createDate") {
    sortedTodos = sortTodosByDate(todos);
  } else if (selectedValue === "name") {
    sortedTodos = sortTodosByName(todos);
  } else if (selectedValue === "priority") {
    sortedTodos = sortTodosByPriority(todos);
  } else {
    sortedTodos = todos;
  }

  renderToDosArray(sortedTodos);
}

function sortTodosByDate(todos) {
  return todos.sort(
    (todo1, todo2) => new Date(todo1.createdAt) - new Date(todo2.createdAt)
  );
}

function sortTodosByName(todos) {
  return todos.sort((todo1, todo2) =>
    todo1.title.localeCompare(todo2.title, undefined, { sensitivity: "base" })
  );
}

function sortTodosByPriority(todos) {
  // codes
  return todos;
}

const filterButton = document.getElementById("filter-dropdown-button");
const filterDropdownContent = document.getElementById(
  "filter-dropdown-content"
);

filterButton.addEventListener("click", () => {
  switchDisplay(filterDropdownContent);
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);
});

const filterStatusDropdownButton = document.getElementById(
  "status-dropdown-button"
);
const filterStatusDropdownContent = document.getElementById(
  "filter-status-dropdown-content"
);

const filterTagsDropdownButton = document.getElementById(
  "tags-dropdown-button"
);
const filterTagsDropdownContent = document.getElementById(
  "filter-tags-dropdown-content"
);

const filterCreateDateDropdownButton = document.getElementById(
  "createDate-dropdown-button"
);
const filterCreateDateDropdownContent = document.getElementById(
  "filter-createDate-dropdown-content"
);

const filterDeadlineDropdownButton = document.getElementById(
  "deadline-dropdown-button"
);
const filterDeadlineDropdownContent = document.getElementById(
  "filter-deadline-dropdown-content"
);

function hideElements(elements) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  elements.forEach((el) => (el.style.display = "none"));
}

filterStatusDropdownButton.addEventListener("click", (event) => {
  hideElements([
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);
  switchDisplay(filterStatusDropdownContent);
  event.stopPropagation();
});

filterTagsDropdownButton.addEventListener("click", (event) => {
  hideElements([
    filterStatusDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);

  switchDisplay(filterTagsDropdownContent);
  event.stopPropagation();
});

filterCreateDateDropdownButton.addEventListener("click", (event) => {
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterDeadlineDropdownContent,
  ]);
  switchDisplay(filterCreateDateDropdownContent);
  event.stopPropagation();
});

filterDeadlineDropdownButton.addEventListener("click", (event) => {
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
  ]);
  switchDisplay(filterDeadlineDropdownContent);
  event.stopPropagation();
});

const cancelFilterButton = document.getElementById("cancelFilterButton");
const acceptFilterButton = document.getElementById("acceptFilterButton");

const createDateAfterInput = filterCreateDateDropdownContent.querySelector(
  "#filter-createDate-after-input"
);
const createDateBeforeInput = filterCreateDateDropdownContent.querySelector(
  "#filter-createDate-before-input"
);
const deadlineAfterInput = filterDeadlineDropdownContent.querySelector(
  "#filter-deadline-after-input"
);
const deadlineBeforeInput = filterDeadlineDropdownContent.querySelector(
  "#filter-deadline-before-input"
);

cancelFilterButton.addEventListener("click", () => {
  switchDisplay(filterDropdownContent);
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);

  filterStatusDropdownContent.selectedIndex = 0;
  createDateAfterInput.value = "";
  createDateBeforeInput.value = "";
  deadlineAfterInput.value = "";
  deadlineBeforeInput.value = "";

  filterTagsDropdownContent.innerHTML = "";
  renderTagsDropdown(filterTagsDropdownContent);

  renderLocalStorageToDosArray();
});
acceptFilterButton.addEventListener("click", () => {
  switchDisplay(filterDropdownContent);
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);
  renderFilteredTodos();
});

function renderFilteredTodos() {
  const filteredTodos = filterTodos();
  const selectedValue = sortButton.textContent.trim();
  let sortedTodos;

  if (selectedValue === "По дате создания") {
    sortedTodos = sortTodosByDate(filteredTodos);
  } else if (selectedValue === "По алфавиту") {
    sortedTodos = sortTodosByName(filteredTodos);
  } else if (selectedValue === "По приоритету") {
    sortedTodos = sortTodosByPriority(filteredTodos);
  } else {
    sortedTodos = filteredTodos;
  }

  renderToDosArray(sortedTodos);
}

function isSubset(arr1, arr2) {
  const filtered = arr2.filter((element) => arr1.includes(element));
  return filtered.length === arr2.length;
}

function filterTodos() {
  const status =
    filterStatusDropdownContent.value === "Все варианты"
      ? null
      : filterStatusDropdownContent.value;

  const tags = getCheckedTags(filterTagsDropdownContent);

  const createDateAfter = createDateAfterInput.value
    ? new Date(createDateAfterInput.value)
    : null;
  const createDateBefore = createDateBeforeInput.value
    ? new Date(createDateBeforeInput.value)
    : null;
  const deadlineAfter = deadlineAfterInput.value
    ? new Date(deadlineAfterInput.value)
    : null;
  const deadlineBefore = deadlineBeforeInput.value
    ? new Date(deadlineBeforeInput.value)
    : null;

  const todos = getToDos();

  const filteredTodos = todos.filter((todo) => {
    debugger
    if (status && todo.status !== status) return false; //короткое замыкание
    if (!isSubset(todo.tags, tags)) return false;
    if (createDateAfter &&  new Date(todo.createdAt) <= createDateAfter) return false;
    if (createDateBefore && new Date(todo.createdAt) >= createDateBefore) return false;
    if (deadlineAfter && new Date(todo.deadline) <= deadlineAfter) return false;
    if (deadlineBefore && new Date(todo.deadline) >= deadlineBefore) return false;

    return true;
  });

  return filteredTodos;
}

inputTemperature();
inputCurrency();

renderLocalStorageToDosArray();

renderTagsDropdown(filterTagsDropdownContent);  