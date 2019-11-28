'use strict';

/*
Jumper List Constants
*/
const LOCAL_STORAGE_JUMPER_LIST_KEY = 'jumper.list';
const LOCAL_STORAGE_SELECTED_JUMPER_KEY = 'jumper.selectedId';
const jumperListContainer = document.querySelector('[data-jumper-list]');
const newJumperForm = document.querySelector('[data-new-jumper-form]');
const newJumperInput = document.querySelector('[data-new-jumper-input]');
const deleteJumperButton = document.querySelector('[data-delete-jumper]');

/*
Jumper Storage
*/
let jumperList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JUMPER_LIST_KEY)) || [];
let selectedJumperId = localStorage.getItem(LOCAL_STORAGE_SELECTED_JUMPER_KEY);

/*
Load Constants
*/
const LOCAL_STORAGE_LOAD_LIST_KEY = 'load.list';
const loadContainer = document.querySelector('[data-load-container]');
const addNewLoadButton = document.querySelector('[data-add-load]');

/*
Load Storage
*/
let loadList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOAD_LIST_KEY)) || [];
let loadNumber = loadList.length;

/*
Setup the event listeners
*/
newJumperForm.addEventListener('submit', e => {
    e.preventDefault();
    const jumperName = newJumperInput.value;
    if (jumperName == null || jumperName ==="") {
        return;
    }
    const jumper = createJumper(jumperName);
    newJumperInput.value = null;
    jumperList.push(jumper);
    saveAndRenderJumpers();
});

jumperListContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedJumperId = e.target.dataset.jumperId;
        saveAndRenderJumpers();
    }
})

deleteJumperButton.addEventListener('click', e => {
    jumperList = jumperList.filter(jumper => jumper.id !== selectedJumperId);
    selectedJumperId = null;
    saveAndRenderJumpers();
})

addNewLoadButton.addEventListener('click', e => {
    if (loadNumber < 0) {
        laodNumber = 0;
    }
    loadNumber++;
    let newLoad = createLoad(loadNumber);
    loadList.push(newLoad);
    createLoadCard(newLoad);
    saveLoads();
})

/*
Functions for creating, saving, and rendering jumpers
*/
function createJumper(name) {
   return { id: Date.now().toString(), name: name };
}

function saveJumpers() {
    localStorage.setItem(LOCAL_STORAGE_JUMPER_LIST_KEY, JSON.stringify(jumperList));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_JUMPER_KEY, selectedJumperId);
}

function renderJumpers() {
    clearElement(jumperListContainer);
    jumperList.forEach(jumper => {
        const listElement = document.createElement('li');
        listElement.dataset.jumperId = jumper.id;
        listElement.classList.add("jumper");
        listElement.setAttribute('draggable', true);
        listElement.innerText = jumper.name;
        if (listElement.dataset.jumperId === selectedJumperId) {
            listElement.classList.add('active-jumper');
        }
        jumperListContainer.appendChild(listElement);
    })
}



function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function saveAndRenderJumpers() {
    saveJumpers();
    renderJumpers();
}


/*
Functions for the load menu
*/
function saveAndRenderLoads() {
    console.log("Not implemented yet");
}

/*
Creates the load object
*/
function createLoad(number) {
    return { id: Date.now().toString(), number: number, jumpers: [] }
}

/*
Saves the load to the local storage
*/
function saveLoads() {
    localStorage.setItem(LOCAL_STORAGE_LOAD_LIST_KEY, JSON.stringify(loadList))
}

/*
Used for rendering the loads after they have been cleared
*/
function renderLoads() {
    let num = 1;
    loadList.forEach(load => {
        createLoadCard(load);
        num++;
    })
}

/*
Creates and appends a load card div to the load container based on the 
load object that is passed in
*/
function createLoadCard(load) {

    // create the div element and add the approprate classes
    const divElement = document.createElement('div');
    divElement.classList.add('load-card');
    divElement.setAttribute('draggable', true);

    // add the draggable dots to the load card
    divElement.appendChild(createDivDraggableDots());

    // Add the header
    const divLoadHeader = document.createElement('div');
    divLoadHeader.classList.add('load-header');
    divLoadHeader.innerText = "Load " + load.number;
    divElement.appendChild(divLoadHeader);

    // add the jumpers from the load to the element
    divElement.appendChild(addJumpersToLoad(load));


    // add the buttons
    divElement.appendChild(addLoadCardButtons(load));

    loadContainer.appendChild(divElement);
}

/*
Function that adds the load card buttons to the load card
*/
function addLoadCardButtons(load) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('buttons');
    
    const removeButton = document.createElement('button');  
    removeButton.dataset.loadId = load.id;

    removeButton.innerText = "Remove";
    removeButton.addEventListener('click', e => {
        loadList = loadList.filter(load => load.id != e.target.dataset.loadId);
 
        loadContainer.removeChild(e.target.parentNode.parentNode)
        loadNumber--;
        saveLoads();
        console.log(loadList);

    })

    const editButton = document.createElement('button');
    editButton.innerText = "Edit";

    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(editButton);

    return buttonContainer;
}

/*
Function that can take an array of jumpers and adds them to the load

returns a ul to be appended to the element
*/
function addJumpersToLoad(load) {
// once we start actually calling into this we will need to first clear the elements
const ul = document.createElement('ul');
    load.jumpers.forEach(jumper => {
        let listItem = document.createElement('li');
        listItem.innerText = jumper.name;
        ul.appendChild(listItem);
    })

    return ul;
}

 /*
Function to create the draggable dots at the top of a load card
 */
function createDivDraggableDots() {
    const divDotContainer = document.createElement('div');
    divDotContainer.classList.add('dot-container');

    const divDot = document.createElement('div');
    divDot.classList.add('draggable-dots');
    for (let i = 0; i < 3; i++) {
        let divDot = document.createElement('div');
        divDot.classList.add('draggable-dots');
        divDotContainer.appendChild(divDot);
    } 

    return divDotContainer;
}


//TODO: refactor into classes

/*
Function to run on page load
*/
window.onload = () => {
    renderJumpers();
    renderLoads();
}
