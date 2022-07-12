//SET ALL MAIN ELEMENTS AND TABS
const inputTask = document.getElementById("item");
const inputTitle = document.getElementById("title");
const inputPomo = document.getElementById("pomodoros");
const form = document.getElementById("form");
const deleteAllBtn = document.getElementById("deleteAllbtn");
const editBtn = document.getElementById("editbtn");
const list = document.querySelector(".list");
const aside = document.getElementById('aside')
const tab1 = document.getElementById('tab1')
const tab2 = document.getElementById('tab2')

//SET EDIT ELEMENTS
const editForm = document.getElementById('editForm')
const editTitle = document.getElementById('editTitle')
const editItem = document.getElementById('editItem')
const editPomodoros = document.getElementById('editPomodoros')
const editTaskDone = document.getElementById('editTaskDone')
const deleteBtn = document.getElementById('deleteTask')

//VARIABLES TO WORK
let totalMinutesLeft = 0;
let totalMinutesDone = 0;
let editId = 0;
let tabActive = 1

//ICONS
const uncheckIco = 
'<svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 512   512"><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>';

const checkIco =
'<svg xmlns="http://www.w3.org/2000/svg" width="1.3rem" height="1.3rem" viewBox="0 0 512   512"><path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>';


//HOOKS
const estimateTime = (pomodoros, to) => {
  const minutes = pomodoros * 25;
  const hours = Math.floor(minutes / 60);
  if(to === 0) {
    totalMinutesLeft += minutes;
  } else if(to === 1) {
    totalMinutesDone += minutes;
  }
  
  let minutesReturned = minutes % 60;
  if (minutesReturned < 10) {
    minutesReturned = `0${minutesReturned}`;
  }
  return `${hours}:${minutesReturned}`;
};


//SAVE ITEM
const saveItem = async () => {
  await fetch("https://warm-meadow-57754.herokuapp.com/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: inputTitle.value,
      description: inputTask.value,
      pomodoros: +inputPomo.value,
    }),
  });
  render();
  inputTask.value = "";
  inputTitle.value = "";
  inputTitle.focus();
};

//RENDER METHOD
const render = async () => {
  let myItems;
  let listItems1 = [];
  let listItems2 = [];
  totalMinutesLeft = 0;
  totalMinutesDone = 0;
  inputPomo.value = "";
  list.innerHTML = "";
  await fetch("https://warm-meadow-57754.herokuapp.com/api/tasks")
    .then((response) => response.json())
    .then((data) => (myItems = data));
  for (let i = 0; i < myItems.length; i++) {
    if (myItems[i].taskDone === 0) {
      listItems1.push(`
      <div class='task' id=${myItems[i].id}>
          
          <div>
              <h3 style='display: inline;'>${
                myItems[i].title
              }</h3>
              ${myItems[i].description ? `: <p style='display: inline;'>${
                myItems[i].description
              }</p>` : ""}
              
          </div>
          <div class='task' style='margin: 0;'>
              <span>Estimated time: ${estimateTime(
                myItems[i].pomodoros, myItems[i].taskDone
              )}</span>&nbsp;&nbsp;
              <span id='icon' >${myItems[i].taskDone? checkIco : uncheckIco}</span>
          </div>
          
      </div>
      `)
    } else if (myItems[i].taskDone === 1) {
      listItems2.push(`
      <div class='task' id=${myItems[i].id}>
          
          <div>
              <h3 style='display: inline;'>${
                myItems[i].title
              }</h3>
              ${myItems[i].description ? `: <p style='display: inline;'>${
                myItems[i].description
              }</p>` : ""}
              
          </div>
          <div class='task' style='margin: 0;'>
              <span>Estimated time: ${estimateTime(
                myItems[i].pomodoros, myItems[i].taskDone
              )}</span>&nbsp;&nbsp;
              <span id='icon' >${myItems[i].taskDone? checkIco : uncheckIco}</span>
          </div>
          
      </div>
      `)
    }
    
  }
  if(tabActive === 1) {
    if (listItems1.length > 0) {
      deleteAllBtn.hidden = false;
    } else {
      deleteAllBtn.hidden = true;
    }
    list.innerHTML = listItems1.join("");
  } else if (tabActive === 2){
    if (listItems2.length > 0) {
      deleteAllBtn.hidden = false;
    } else {
      deleteAllBtn.hidden = true;
    }
    list.innerHTML = listItems2.join("");
  }
  
  hoursLeft = Math.round(totalMinutesLeft / 60);
  hoursDone = Math.round(totalMinutesDone / 60);
  document.getElementById("estimatedHours").innerText = hoursLeft;
  document.getElementById("remainingTasks").innerText = listItems1.length;
  document.getElementById("tasksDone").innerText = listItems2.length;
  document.getElementById("hoursRunning").innerText = hoursDone
};

//EDIT METHOD (TO SHOW IN ASIDE)
const editTask = async (id) => {
  targetID = id
  let result = ''
  await fetch(`https://warm-meadow-57754.herokuapp.com/api/tasks/${targetID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
    .then(data => result = data);
  editId = result[0]
  editTitle.value = result[1]
  editItem.value = result[2]
  editPomodoros.value = result[3]
  editTaskDone.checked = result[4] === 0? false : true
  editForm.hidden= false;
}


//DELETE ALL ITEMS METHOD
const deleteItems = async () => {
  await fetch("https://warm-meadow-57754.herokuapp.com/api/tasks/all", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  editForm.hidden = true;
  render();
};

//DELETE SINGLE TASK METHOD
const removeTask = async () => {
    await fetch(`https://warm-meadow-57754.herokuapp.com/api/tasks/${targetID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    editForm.hidden = true;
    render();
};


//LIST MANAGER FOR EVENTS (EDIT)
const listManager = async (e) => {
  if (e.target.tagName === 'DIV' && e.target.id) {
    editTask(e.target.id)
  } else if (e.target.tagName === 'H3' || e.target.tagName === 'P' || e.target.tagName === 'SPAN') {
   editTask(e.target.parentElement.parentElement.id)
  }
}

//SENT EDITED METHOD
const sentEdit = async () => {
  await fetch(`https://warm-meadow-57754.herokuapp.com/api/tasks/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: editTitle.value,
      description: editItem.value,
      pomodoros: +editPomodoros.value,
      taskDone: editTaskDone.checked? 1 : 0,
    })
  });
  editForm.hidden = true
  render();
}

//EVENT LISTENER FOR ALL EVENTS
deleteAllBtn.addEventListener("dblclick", () => deleteItems());
deleteBtn.addEventListener("dblclick", () => removeTask())
list.addEventListener("click", listManager);
form.addEventListener("submit", (e) => {
  editForm.hidden = true
  if (inputTitle && inputTask) {
    saveItem();
  }
  e.preventDefault();
});

editForm.addEventListener("submit", (e) =>{
  sentEdit()
e.preventDefault();
})

tab1.addEventListener("click", (e) => {
  tab2.parentElement.setAttribute("class", "tab")
  e.target.parentElement.setAttribute("class", "tab selected")
  tabActive = 1
  editForm.hidden= true
  render()
})
tab2.addEventListener("click", (e) => {
  tab1.parentElement.setAttribute("class", "tab")
  e.target.parentElement.setAttribute("class", "tab selected")
  tabActive = 2
  editForm.hidden= true
  render()
})

//START THE APP
render();