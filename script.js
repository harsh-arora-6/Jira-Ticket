const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalCont = document.querySelector(".modal-cont");
const textareaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const toolboxColors = document.querySelectorAll('.color');


let addFlag = false;
const colors = ["lightpink","lightgreen","aqua","yellow"];
let modalPriorityColor = colors[allPriorityColors.length - 1];
let locked = true;
let removeTicket = false;
let ticketsArr = [];

for(let i = 0;i < toolboxColors.length;i++){
    // click a toolbox color to get only those colored tickets
    toolboxColors[i].addEventListener('click',(e)=>{
        let newTicketsArr = ticketsArr.filter((ticket)=>{
            return toolboxColors[i].classList[0] === ticket.ticketCol;
        })
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let j = 0;j < allTickets.length;j++){
            allTickets[j].remove();
        }
        for(let newTicket of newTicketsArr){
            createTicket(newTicket.ticketCol,newTicket.ticketId,newTicket.taskArea);
        }
    })
    // double click a toolbox color to get all the tickets
    toolboxColors[i].addEventListener('dblclick',(e)=>{
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let j = 0;j < allTickets.length;j++){
            allTickets[j].remove();
        }
        for(let ticket of ticketsArr){
            createTicket(ticket.ticketCol,ticket.ticketId,ticket.taskArea);
        }
    })
}
// toggling the modal container
addBtn.addEventListener('click',(e)=>{
    addFlag = !addFlag
    if(addFlag){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
        textareaCont.value = "";
    }
})

allPriorityColors.forEach((colorElement)=>{
    colorElement.addEventListener("click",(e)=>{
        allPriorityColors.forEach(priorityColor =>{
            priorityColor.classList.remove("border");
        })
        modalPriorityColor = colorElement.classList[0];
        colorElement.classList.add("border");
    })
    
})

modalCont.addEventListener("keydown",(e)=>{
    if(e.key == "Shift"){
        createTicket(modalPriorityColor,undefined,textareaCont.value);
        setDefaultModal();
    }
})
function createTicket(ticketCol,ticketId,taskArea){
    let id = ticketId||shortid();
    const ticket = document.createElement("div");
    ticket.setAttribute("class","ticket-cont");
    ticket.innerHTML = `<div class="ticket-color ${ticketCol}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${taskArea}</div>
    <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>`;
    mainCont.appendChild(ticket);
    // add ticket to array if ticket is newly created
    if(!ticketId)ticketsArr.push({ticketCol,ticketId:id,taskArea});
    handleColor(ticket);
    handleLock(ticket);
    handleRemoval(ticket);
}
// after activating remove mode ,by clicking on a ticket we can remove it
function handleRemoval(ticket){
    
    removeBtn.addEventListener("click",(e)=>{
        removeTicket = !removeTicket;
    });
    ticket.addEventListener("click",(e)=>{
        if(removeTicket)ticket.remove();
    })
}
// adding lock-unlock functionality to disable-enable editing in a ticket
function handleLock(ticket){
    let ticketLockElem = ticket.children[3].children[0];
    let lockedClass = "fa-lock";
    let unlockedClass = "fa-lock-open";
    const ticketTask = ticket.querySelector('.task-area');
    ticketLockElem.addEventListener("click",(e)=>{
        locked = !locked;
        if(locked){
            ticketLockElem.classList.remove(unlockedClass);
            ticketLockElem.classList.add(lockedClass);
            ticketTask.setAttribute("contenteditable","false");
        }else{
            ticketLockElem.classList.remove(lockedClass);
            ticketLockElem.classList.add(unlockedClass);
            ticketTask.setAttribute("contenteditable","true");
        }
    })
}
// clicking on ticket color element to get next ticket color
function handleColor(ticket){
    let ticketColElem = ticket.children[0];
    ticketColElem.addEventListener("click",(e) => {
        let ticketCol = ticketColElem.classList[1];
        let currentColId = colors.findIndex((col,idx) =>{
            return col === ticketCol;
        })
        currentColId = (currentColId+1)%colors.length;
        ticketColElem.classList.remove(ticketCol);
        ticketColElem.classList.add(colors[currentColId]);
    })
}
//reset the modal
function setDefaultModal(){
    modalCont.style.display = "none";
    textareaCont.value = "";
    addFlag = false;
    document.querySelector(".border").classList.remove("border");
    allPriorityColors[3].classList.add("border");
    modalPriorityColor = colors[colors.length-1];
}