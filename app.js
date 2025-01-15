async function fetchDataWeather(){
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=1ea453f5501c528eb93b8765879e5373')
    const data = await response.json()
    return data
}

async function fetchDataCurrency(){
    const response = await fetch('https://api.nbrb.by/exrates/rates/431')
    const data = await response.json()
    return data
}

async function getTemperature(){
    const data = await fetchDataWeather()
    let temp =`${(data.main.temp-273).toFixed(1)} °C`
    return temp
}

async function getCurrency(){
    const data = await fetchDataCurrency()
    let curr =`${data.Cur_OfficialRate.toFixed(2)} BYN`
    return curr
}

async function inputTemperature(){
    let temperature = await getTemperature()
    const tempDiv = document.getElementById("weather")
    tempDiv.append(temperature)
}

async function inputCurrency(){
    let currency = await getCurrency()
    const currDiv = document.getElementById("currency")
    currDiv.append(currency)
}

inputTemperature()
inputCurrency()

const createTodoButton = document.getElementById('createTodo-button')
const creationTodoWindow = document.getElementById('createTodo-dialog')
const closeTodoButton = document.getElementById('closeModal')

function openModalWindow(){
    creationTodoWindow.showModal()
}

function closeModalWindow(){
    creationTodoWindow.close()
}

createTodoButton.addEventListener('click', openModalWindow)
closeTodoButton.addEventListener('click', closeModalWindow)