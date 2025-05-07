/**
 * Класс ToDoList представляет собой список задач.
 */
 class ToDoList {
  /**
   * Создает новый экземпляр ToDoList.
   * @param {Object[]} array - Массив задач.
   */
  constructor(array) {
    this.todos = array;
  }

  /**
   * Добавляет новую задачу в список.
   * @param {Object} newToDo - Новая задача.
   */
  addToDo(newToDo) {
    this.todos.push(newToDo);
  }

  /**
   * Удаляет задачу по её ID.
   * @param {string|number} id - Идентификатор задачи.
   */
  deleteToDoById(id) {
    const index = this.todos.findIndex(
      (item) => String(item.id) === String(id)
    );
    this.todos.splice(index, 1);
  }

  /**
   * Возвращает задачу по её ID.
   * @param {string|number} id - Идентификатор задачи.
   * @returns {Object|undefined} Задача или undefined, если не найдена.
   */
  getToDoById(id) {
    return this.todos.find((item) => String(item.id) === String(id));
  }

  /**
   * Заменяет задачу с указанным ID на новую.
   * @param {string|number} id - Идентификатор задачи.
   * @param {Object} todo - Новая задача.
   */
  replaceToDoById(id, todo) {
    const index = this.todos.findIndex(
      (item) => String(item.id) === String(id)
    );
    this.todos[index] = todo;
  }
}

/**
 * Класс TagList представляет собой список тегов.
 */
class TagList {
  /**
   * Создает новый экземпляр TagList.
   * @param {string[]} array - Массив тегов.
   */
  constructor(array) {
    this.tags = array;
  }

  /**
   * Добавляет новый тег в список.
   * @param {string} newTag - Новый тег.
   */
  addTag(newTag) {
    this.tags.push(newTag);
  }

  /**
   * Проверяет, содержится ли указанный тег в списке.
   * @param {string} tag - Тег для проверки.
   * @returns {boolean} true, если тег присутствует, иначе false.
   */
  isIncludesTag(tag) {
    return this.tags.includes(tag);
  }
}

const LOCAL_STORAGE_TODOLIST_KEY = "todo";
const LOCAL_STORAGE_TAGLIST_KEY = "tag";
const MAX_NAME_LENGTH = 25;
const MAX_TODODESC_LENGTH = 300;

// DOM Elements: Weather and Currency
const tempDiv = document.getElementById("weather");
const currDiv = document.getElementById("currency");

// DOM Elements: Create Task Modal
const newToDoName = document.getElementById("newToDo-name");
const newToDoDate = document.getElementById("newToDo-deadline");
const newToDoDesc = document.getElementById("newToDo-description");
const newToDoStatus = document.getElementById("newToDo-status");
const newToDoLongNameErr = document.getElementById("newToDo-long-name-error");
const newToDoEmptyNameErr = document.getElementById("newToDo-empty-name-error");
const newToDoDateErr = document.getElementById("newToDo-date-error");
const newToDoDescErr = document.getElementById("newToDo-desc-error");
const newToDoTagsErr = document.getElementById("newToDo-tags-error");

newToDoName.addEventListener("input", () => {
  hideElements(newToDoEmptyNameErr);
  if (newToDoName.value.length > MAX_NAME_LENGTH) {
    newToDoName.value = newToDoName.value.slice(0, MAX_NAME_LENGTH);
    newToDoLongNameErr.style.display = "block";
  } else {
    hideElements(newToDoLongNameErr);
  }
});

newToDoDesc.addEventListener("input", () => {
  if (newToDoDesc.value.length > 300) {
    newToDoDesc.value = newToDoDesc.value.slice(0, 300);
    newToDoDescErr.style.display = "block";
  } else {
    hideElements(newToDoDescErr);
  }
});

newToDoDate.addEventListener("input", () => {
  hideElements(newToDoDateErr);
});

// DOM Elements: Create Tag Modal
const newTagName = document.getElementById("createTag-name");
const newTagEmptyNameErr = document.getElementById("newTag-empty-name-error");
const newTagExistingNameErr = document.getElementById("newTag-existing-name-error");
const newTagLongNameErr = document.getElementById("newTag-long-name-error");

newTagName.addEventListener("input", () => {
  if (newTagName.value.length > MAX_NAME_LENGTH) {
    newTagName.value = newTagName.value.slice(0, MAX_NAME_LENGTH);
    newTagLongNameErr.style.display = "block";
  } else {
    hideElements(newTagLongNameErr);
  }
});

// DOM Elements: Edit Task Modal
const editTodoName = document.getElementById("editToDo-name");
const editTodoDate = document.getElementById("editToDo-deadline");
const editTodoDesc = document.getElementById("editToDo-description");
const editTodoStatus = document.getElementById("editToDo-status");
const editToDoLongNameErr = document.getElementById("editToDo-long-name-error");
const editToDoEmptyNameErr = document.getElementById("editToDo-empty-name-error");
const editToDoDateErr = document.getElementById("editToDo-date-error");
const editToDoDescErr = document.getElementById("editToDo-desc-error");
const editToDoTagsErr = document.getElementById("editToDo-tags-error");

editTodoName.addEventListener("input", () => {
  hideElements(editToDoEmptyNameErr);
  if (editTodoName.value.length > MAX_NAME_LENGTH) {
    editTodoName.value = editTodoName.value.slice(0, MAX_NAME_LENGTH);
    editToDoLongNameErr.style.display = "block";
  } else {
    hideElements(editToDoLongNameErr);
  }
});

editTodoDesc.addEventListener("input", () => {
  if (editTodoDesc.value.length > 300) {
    editTodoDesc.value = editTodoDesc.value.slice(0, 300);
    editToDoDescErr.style.display = "block";
  } else {
    hideElements(editToDoDescErr);
  }
});

editTodoDate.addEventListener("input", () => {
  hideElements(editToDoDateErr);
});

// Buttons
const createTodoButton = document.getElementById("createTodo-button");
const cancelCreateToDoButton = document.getElementById("closeModal");
const acceptCreateToDoButton = document.getElementById("acceptCreation");
const createTagButton = document.getElementById("createTag-button");
const cancelCreateTagButton = document.getElementById("closeCreateTagModal");
const acceptCreateTagButton = document.getElementById("acceptCreateTagModal");
const cancelEditButton = document.getElementById("closeEditModal");
const acceptEditButton = document.getElementById("acceptEdit");

// Modals
const createTodoModal = document.getElementById("createTodo-dialog");
const editTodoModal = document.getElementById("editTodo-dialog");
const createTagModal = document.getElementById("createTag-dialog");

// Toast & Template
const toastElement = document.getElementById("toast");
const todoContainer = document.getElementById("todo-container");
const template = document.getElementById("template");

// Sorting
const sortButton = document.getElementById("sort-dropdown-button");
const sortOptionsList = document.getElementById("sort-dropdown-content");

// Dropdowns for Create/Edit Modals
const createModalDropdownButton = document.getElementById("create-modal-tags-dropdown-button");
const createModalDropdownContent = document.getElementById("create-modal-tags-dropdown-content");
const createModalDropdownHide = document.getElementById("create-modal-tags-dropdown-hide-button");

createModalDropdownHide.addEventListener("click", () => {
  hideElements(createModalDropdownContent);
});

createModalDropdownButton.addEventListener("click", () => {
  switchDisplay(createModalDropdownContent);
  hideElements(newToDoTagsErr);
});

const editModalDropdownButton = document.getElementById("edit-modal-tags-dropdown-button");
const editModalDropdownContent = document.getElementById("edit-modal-tags-dropdown-content");
const editModalDropdownHide = document.getElementById("edit-modal-tags-dropdown-hide-button");

editModalDropdownHide.addEventListener("click", () => {
  hideElements(editModalDropdownContent);
});

editModalDropdownButton.addEventListener("click", () => {
  switchDisplay(editModalDropdownContent);
});

// Event Listeners for Modals
createTodoButton.addEventListener("click", () => {
  openCreateToDoModal();
  hideElements(Array.from(createTodoModal.querySelectorAll(".errorMessage")));
});
cancelCreateToDoButton.addEventListener("click", closeCreateToDoModal);
acceptCreateToDoButton.addEventListener("click", () => {
  renderNewToDo();
  hideElements(newToDoLongNameErr, newToDoDescErr);
});
cancelEditButton.addEventListener("click", closeEditToDoModal);
acceptEditButton.addEventListener("click", renderEditedToDo);
createTagButton.addEventListener("click", () => {
  openCreateTagModal();
  hideElements(Array.from(createTagModal.querySelectorAll(".errorMessage")));
});
cancelCreateTagButton.addEventListener("click", closeCreateTagModal);
acceptCreateTagButton.addEventListener("click", () => {
  createNewTag();
  hideElements(newTagLongNameErr);
});

// Sorting Dropdown Events
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

// Фильтрация

const filterButton = document.getElementById("filter-dropdown-button");
const filterDropdownContent = document.getElementById("filter-dropdown-content");

filterButton.addEventListener("click", () => {
  switchDisplay(filterDropdownContent);
  hideElements([
    filterStatusDropdownContent,
    filterTagsDropdownContent,
    filterCreateDateDropdownContent,
    filterDeadlineDropdownContent,
  ]);
});

const filterStatusDropdownButton = document.getElementById("status-dropdown-button");
const filterStatusDropdownContent = document.getElementById("filter-status-dropdown-content");
const filterTagsDropdownButton = document.getElementById("tags-dropdown-button");
const filterTagsDropdownContent = document.getElementById("filter-tags-dropdown-content");
const filterCreateDateDropdownButton = document.getElementById("createDate-dropdown-button");
const filterCreateDateDropdownContent = document.getElementById("filter-createDate-dropdown-content");
const filterDeadlineDropdownButton = document.getElementById("deadline-dropdown-button");
const filterDeadlineDropdownContent = document.getElementById("filter-deadline-dropdown-content");


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

const createDateAfterInput = filterCreateDateDropdownContent.querySelector("#filter-createDate-after-input");
const createDateBeforeInput = filterCreateDateDropdownContent.querySelector("#filter-createDate-before-input");
const deadlineAfterInput = filterDeadlineDropdownContent.querySelector("#filter-deadline-after-input");
const deadlineBeforeInput = filterDeadlineDropdownContent.querySelector("#filter-deadline-before-input");

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

// Weather & Currency Fetching
async function fetchDataWeather() {
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=1ea453f5501c528eb93b8765879e5373"
    );
    const data = await response.json();
    return data;
    
  } catch (error) {
    throw new Error('Something went wrong...')
  }
}

async function fetchDataCurrency() {
  try {
    const response = await fetch("https://api.nbrb.by/exrates/rates/431");
  const data = await response.json();
  return data;
  } catch (error) {
    throw new Error('Something went wrong...')
  }
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

/**
 * Открывает модальное окно создания задачи.
 */
function openCreateToDoModal() {
  clearEl(createModalDropdownContent);
  renderTagsDropdown(createModalDropdownContent);
  createTodoModal.showModal();
}

/**
 * Открывает модальное окно редактирования задачи.
 */
function openEditToDoModal() {
  clearEl(editModalDropdownContent);
  renderTagsDropdown(editModalDropdownContent);
  editTodoModal.showModal();
}

/**
 * Закрывает модальное окно создания задачи.
 */
function closeCreateToDoModal() {
  createTodoModal.close();
  hideElements(newToDoLongNameErr, newToDoDescErr);
}

/**
 * Закрывает модальное окно редактирования задачи.
 */
function closeEditToDoModal() {
  editTodoModal.close();
}

/**
 * Открывает модальное окно создания тега.
 */
function openCreateTagModal() {
  createTagModal.showModal();
}

/**
 * Закрывает модальное окно создания тега.
 */
function closeCreateTagModal() {
  createTagModal.close();
  hideElements(newTagLongNameErr);
}

/**
 * Отрисовывает список тегов в выпадающем меню.
 * @param {HTMLElement} parentEl - Родительский элемент.
 */
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

/**
 * Получает текущий список задач из localStorage.
 * @returns {ToDoList} Экземпляр ToDoList.
 */
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

/**
 * Получает массив задач.
 * @returns {Object[]} Массив задач.
 */
function getToDos() {
  return getToDoList().todos;
}

/**
 * Получает текущий список тегов из localStorage.
 * @returns {TagList} Экземпляр TagList.
 */
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

/**
 * Получает массив тегов.
 * @returns {string[]} Массив тегов.
 */
function getTags() {
  return getTagList().tags;
}

/**
 * Сохраняет список задач в localStorage.
 * @param {ToDoList} toDoList - Список задач.
 */
function uploadToDoListToLocalStorage(toDoList) {
  localStorage.setItem(LOCAL_STORAGE_TODOLIST_KEY, JSON.stringify(toDoList));
}

/**
 * Сохраняет список тегов в localStorage.
 * @param {TagList} tagList - Список тегов.
 */
function uploadTagListToLocalStorage(tagList) {
  localStorage.setItem(LOCAL_STORAGE_TAGLIST_KEY, JSON.stringify(tagList));
}

/**
 * Проверяет, что имя задачи не пустое и длина меньше максимальной.
 * @param {string} name - Название задачи.
 * @returns {boolean} true, если прошло валидацию.
 */
function isNameValid(name) {
  return name.trim().length > 0 && name.trim().length < MAX_NAME_LENGTH;
}

/**
 * Проверяет, что описание задачи не слишком длинное.
 * @param {string} desc - Описание задачи.
 * @returns {boolean} true, если прошло валидацию.
 */
function isDescriptionValid(desc) {
  return desc.trim().length < MAX_TODODESC_LENGTH;
}

/**
 * Проверяет, что дата корректна и не раньше сегодняшней.
 * @param {string} date - Дата в формате строки.
 * @returns {boolean} true, если дата валидна.
 */
function isDateValid(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !isNaN(selectedDate) && selectedDate >= today;
}

/**
 * Проверяет, выбран хотя бы один тег.
 * @param {string[]} tags - Массив тегов.
 * @returns {boolean} true, если есть теги.
 */
function areTagsValid(tags) {
  return tags.length > 0;
}

/**
 * Проверяет, существует ли тег уже в списке.
 * @param {string} tag - Название тега.
 * @returns {boolean} true, если тег не существует.
 */
function doesTagExist(tag) {
  const tagList = getTagList();
  return !tagList.isIncludesTag(tag);
}

/**
 * Проверяет валидность данных при создании новой задачи.
 * @returns {boolean} true, если данные валидны.
 */
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

/**
 * Проверяет валидность данных при создании нового тега.
 * @returns {boolean} true, если данные валидны.
 */
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

/**
 * Проверяет валидность данных при редактировании задачи.
 * @returns {boolean} true, если данные валидны.
 */
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

/**
 * Добавляет новый тег.
 */
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

/**
 * Генерирует уникальный ID для задачи.
 * @returns {number} Уникальный числовой ID.
 */
function generateUniqueId() {
  return Date.now() - Math.floor(Math.random() * 1000);
}

/**
 * Создаёт новую задачу на основе данных из формы.
 * @returns {Object} Объект задачи.
 */
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
    priority: false,
  };
  return newToDo;
}

/**
 * Добавляет новую задачу в список и обновляет интерфейс.
 */
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

/**
 * Обновляет существующую задачу.
 * @param {string|number} id - ID задачи.
 */
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

/**
 * Устанавливает чекбоксы в модальном окне редактирования.
 * @param {Object} todo - Задача.
 */
function chooseCheckboxesEditModal(todo) {
  const checkboxes = editModalDropdownContent.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (todo.tags.includes(checkbox.value)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  });
}

/**
 * Инициализирует редактирование задачи: заполняет поля и показывает модалку.
 * @param {string|number} id - ID задачи.
 */
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

/**
 * Удаляет задачу по ID.
 * @param {string|number} id - ID задачи.
 */
function deleteToDo(id) {
  const toDoList = getToDoList();
  toDoList.deleteToDoById(id);
  uploadToDoListToLocalStorage(toDoList);
}

/**
 * Подтверждает удаление задачи через confirm.
 * @param {string|number} id - ID задачи.
 */
function confirmDeleteToDo(id) {
  const confirmation = confirm("Вы уверены, что хотите удалить задачу?");
  if (confirmation) {
    deleteToDo(id);
    showCustomToast("Задача удалена!");
    renderLocalStorageToDosArray();
  }
}

/**
 * Инициализирует DOM-элемент задачи из шаблона.
 * @param {Object} todo - Задача.
 * @returns {DocumentFragment} DOM-элемент задачи.
 */
function initToDoIntoTemplate(todo) {
  const item = template.content.cloneNode(true);
  item.querySelector(".todo-name").textContent = todo.title;
  item.querySelector(".todo-description").textContent = todo.description;
  item.querySelector(".todo-deadline").textContent = todo.deadline;
  item.querySelector(".todo-tags").textContent = todo.tags;
  item.querySelector(".todo-status").textContent = todo.status;
  item
    .querySelector(".delete-todo-button")
    .addEventListener("click", function () {
      confirmDeleteToDo(todo.id);
    });
  item
    .querySelector(".edit-todo-button")
    .addEventListener("click", function () {
      initEditToDoModal(todo.id);
      hideElements(Array.from(editTodoModal.querySelectorAll(".errorMessage")));
    });
  item
    .querySelector(".priority-button")
    .addEventListener("click", function (event) {
      changePriority(todo);
      changePriorityImg(event.target);
    });
  item.querySelector(".priority-button").style.backgroundImage = todo.priority
    ? "url('filled-star-icon.png')"
    : "url('empty-star-icon.png')";
  return item;
}

/**
 * Переключает приоритет задачи.
 * @param {Object} todo - Задача.
 */
function changePriority(todo) {
  todo.priority = !todo.priority;
  const todoList = getToDoList();
  todoList.replaceToDoById(todo.id, todo);
  uploadToDoListToLocalStorage(todoList);
}

/**
 * Обновляет изображение звездочки приоритета.
 * @param {HTMLElement} button - Кнопка приоритета.
 */
function changePriorityImg(button) {
  if (!button.style.backgroundImage.includes("filled-star-icon.png")) {
    button.style.backgroundImage = "url('filled-star-icon.png')";
  } else {
    button.style.backgroundImage = "url('empty-star-icon.png')";
  }
}

/**
 * Рендерит отредактированную задачу.
 */
function renderEditedToDo() {
  const id = editTodoModal.querySelector("#hidden-input-todoId").value;
  editToDo(id);
}

/**
 * Добавляет задачу в контейнер на странице.
 * @param {Object} todo - Задача.
 */
function renderToDo(todo) {
  const item = initToDoIntoTemplate(todo);
  todoContainer.append(item);
}

/**
 * Очищает содержимое элемента.
 * @param {HTMLElement} el - HTML-элемент.
 */
function clearEl(el) {
  el.innerHTML = "";
}

/**
 * Рендерит все задачи из localStorage.
 */
function renderLocalStorageToDosArray() {
  const todosArray = getToDos();
  renderToDosArray(todosArray);
}

/**
 * Рендерит заданный массив задач.
 * @param {Object[]} toDosArray - Массив задач.
 */
function renderToDosArray(toDosArray) {
  clearEl(todoContainer);
  for (let i = 0; i < toDosArray.length; i++) {
    renderToDo(toDosArray[i]);
  }
}

/**
 * Отображает уведомление.
 * @param {string} message - Сообщение.
 */
function showCustomToast(message) {
  toastElement.textContent = message;
  toastElement.classList.remove("hidden");
  setTimeout(() => {
    toastElement.classList.add("hidden");
  }, 3000);
}

/**
 * Возвращает выбранные чекбоксы (теги).
 * @param {HTMLElement} modalWindow - Модальное окно.
 * @returns {string[]} Массив значений чекбоксов.
 */
function getCheckedTags(modalWindow) {
  let checkboxes = modalWindow.querySelectorAll('input[type="checkbox"]');
  let checkedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
  let checkedTags = checkedCheckboxes.map((checkbox) => checkbox.value);
  return checkedTags;
}

/**
 * Переключает видимость элемента.
 * @param {HTMLElement} el - HTML-элемент.
 */
function switchDisplay(el) {
  el.style.display = el.style.display === "block" ? "none" : "block";
}

/**
 * Рендерит отсортированные задачи.
 * @param {string} selectedValue - Критерий сортировки.
 * @param {Object[]} todos - Массив задач.
 */
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

/**
 * Сортирует задачи по дате создания.
 * @param {Object[]} todos - Массив задач.
 * @returns {Object[]} Отсортированный массив.
 */
function sortTodosByDate(todos) {
  return todos.sort((todo1, todo2) => new Date(todo1.createdAt) - new Date(todo2.createdAt));
}

/**
 * Сортирует задачи по названию.
 * @param {Object[]} todos - Массив задач.
 * @returns {Object[]} Отсортированный массив.
 */
function sortTodosByName(todos) {
  return todos.sort((todo1, todo2) =>
    todo1.title.localeCompare(todo2.title, undefined, { sensitivity: "base" })
  );
}

/**
 * Сортирует задачи по приоритету.
 * @param {Object[]} todos - Массив задач.
 * @returns {Object[]} Отсортированный массив.
 */
function sortTodosByPriority(todos) {
  return todos.sort((todo1, todo2) => {
    if (todo1.priority === todo2.priority) return 0;
    return todo1.priority ? -1 : 1;
  });
}

function hideElements(elements) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  elements.forEach((el) => (el.style.display = "none"));
}

/**
 * Применяет фильтры и перерисовывает список задач.
 */
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

/**
 * Проверяет, является ли arr2 подмножеством arr1.
 * @param {string[]} arr1 - Исходный массив.
 * @param {string[]} arr2 - Проверяемый массив.
 * @returns {boolean} true, если arr2 — подмножество arr1.
 */
function isSubset(arr1, arr2) {
  const filtered = arr2.filter((element) => arr1.includes(element));
  return filtered.length === arr2.length;
}

/**
 * Фильтрует задачи по заданным критериям.
 * @returns {Object[]} Отфильтрованный массив задач.
 */
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
    if (status && todo.status !== status) return false;
    if (!isSubset(todo.tags, tags)) return false;
    if (createDateAfter && new Date(todo.createdAt) <= createDateAfter) return false;
    if (createDateBefore && new Date(todo.createdAt) >= createDateBefore) return false;
    if (deadlineAfter && new Date(todo.deadline) <= deadlineAfter) return false;
    if (deadlineBefore && new Date(todo.deadline) >= deadlineBefore) return false;
    return true;
  });
  return filteredTodos;
}

// Инициализация при загрузке
inputTemperature();
inputCurrency();
renderLocalStorageToDosArray();
renderTagsDropdown(filterTagsDropdownContent);