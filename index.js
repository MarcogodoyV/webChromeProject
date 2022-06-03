const inputItem = document.getElementById('item')
const form = document.getElementById('form')
const inputBtn = document.getElementById('submitBtn')
const list = document.querySelector('.list')

const itemsFromLS = JSON.parse(localStorage.getItem('todoItems'))

console.log(itemsFromLS)

if(itemsFromLS) {
    myItems = itemsFromLS
} else {
    myItems = []
}

const saveItem = () => {
    myItems.push(inputItem.value)
    localStorage.setItem(`todoItems`,`${JSON.stringify(myItems)}`)
    console.log(myItems)
    render(inputItem.value)
    inputItem.value = ''
}

form.addEventListener('submit', (e) => {
    saveItem()
    e.preventDefault()
})

const render = (i) => {
    let listItems = ""
    for (let i = 0; i < myItems.length; i++) {
        listItems += `
        <div><input type="checkbox">&nbsp;<span>${myItems[i]}</span></div>
        `}
    list.innerHTML = listItems
}

render()