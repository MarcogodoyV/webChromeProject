const inputTask = document.getElementById('item')
const inputTitle = document.getElementById('title')
const inputPomo = document.getElementById('pomodoros')
const form = document.getElementById('form')
const inputBtn = document.getElementById('submitBtn')
const deleteBtn = document.getElementById('deletebtn')
const list = document.querySelector('.list')

let totalMinutes = 0

//dummy data
const testing = localStorage.setItem(`todoItems`,`${JSON.stringify([
    {id: 0, title: "titulo prueba",task: "task prueba", pomodoros: 1},
    {id: 1, title: "titulo prueba",task: "task prueba", pomodoros: 5},
    {id: 2, title: "titulo prueba",task: "task prueba", pomodoros: 2},
    {id: 3, title: "titulo prueba",task: "task prueba", pomodoros: 1},
    {id: 4, title: "titulo prueba",task: "task prueba", pomodoros: 3},
    {id: 5, title: "titulo prueba",task: "task prueba", pomodoros: 2},
    {id: 6, title: "titulo prueba",task: "task prueba", pomodoros: 6},

])}`)
// dummy data

const removeIco = '<svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>'

const itemsFromLS = JSON.parse(localStorage.getItem('todoItems'))

if(itemsFromLS) {
    myItems = itemsFromLS
} else {
    myItems = []
}

const estimateTime = (pomodoros) =>{
    const minutes = pomodoros*25
    const hours = Math.floor(minutes/60)
    totalMinutes += minutes
    console.log(totalMinutes)
    let minutesReturned = minutes%60
    if(minutesReturned < 10) {
        minutesReturned = `0${minutesReturned}`
    }
    return `${hours}:${minutesReturned}`
}

const saveItem = () => {
    myItems.push({id: myItems.length, 
        title: inputTitle.value,
        task: inputTask.value,
        pomodoros: +inputPomo.value
    })
    localStorage.setItem(`todoItems`,`${JSON.stringify(myItems)}`)
    render()
    inputTask.value = ''
    inputTitle.value = ''
    inputTitle.focus()
}

form.addEventListener('submit', (e) => {
    if(inputTitle && inputTask) {
        saveItem()
    }
    e.preventDefault()
})

const render = () => {
    totalMinutes = 0
    inputPomo.value = ''
    list.innerHTML= ''
    let listItems = ""
    for (let i = 0; i < myItems.length; i++) {
        listItems += `
        <div class='task' id=${myItems[i].id}>
            <div>
                <h3 style='display: inline;'>${myItems[i].title}:</h3>
                <p style='display: inline;'>${myItems[i].task}</p>
            </div>
            <div class='task' style='margin: 0;'>
                <span>Estimated time: ${estimateTime(myItems[i].pomodoros)}</span>&nbsp;&nbsp;
                <span>${removeIco}</span>
            </div>
            
        </div>
        `}
    list.innerHTML = listItems

    hoursLeft = Math.round(totalMinutes/60)
    console.log(`Hours : ${hoursLeft}`)
    document.getElementById('estimatedHours').innerText = hoursLeft
    document.getElementById('remainingTasks').innerText = myItems.length
}

const deleteItems = () => {
    localStorage.removeItem('todoItems')
    myItems = []
    render()
}

const removeTask = (e) => {
    if (e.target.parentElement.parentElement.parentElement.parentElement.classList.contains('task')) {
        let t = myItems.filter(task => task.id != e.target.parentElement.parentElement.parentElement.parentElement.id)
        e.target.parentElement.parentElement.parentElement.remove()
        localStorage.removeItem('todoItems')
        localStorage.setItem(`todoItems`,`${JSON.stringify(t)}`)
        myItems = t
    }
    render()
}

deleteBtn.addEventListener('click', () => deleteItems())
list.addEventListener('click', removeTask)

render()