class ToDoList {
  constructor() {
    this.todos = [];
  }

  addToDo(newToDo) {
    this.todos.push(newToDo);
    alert("Задача добавлена!");
  }

  removeToDoById(todoId) {
    //code
  }
}

const LOCAL_STORAGE_KEY = 1;

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

function closeCreationModalWindow() {
  creationTodoWindow.close();
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
    return false
  }

  return true;
}

function generateUniqueId() {
  return Date.now() - Math.floor(Math.random() * 1000);
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
    toDoList.addToDo(newToDo)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDoList));
    console.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
    closeCreationModalWindow()
  }
}

function renderToDos(){
  for (let i = 0; i < toDoList.length; i++) {
    toDoList[i];
    //doka tag template
  }
}

const createTodoButton = document.getElementById("createTodo-button");
const creationTodoWindow = document.getElementById("createTodo-dialog");
const cancelCreationButton = document.getElementById("closeModal");
const acceptCreationButton = document.getElementById("acceptCreation");

createTodoButton.addEventListener("click", openModalWindow);
cancelCreationButton.addEventListener("click", closeCreationModalWindow);
acceptCreationButton.addEventListener("click", createNewToDo);

const toDoList = new ToDoList();