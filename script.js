'use strict';
const LOCAL_STORAGE_JUMPER_LIST_KEY = 'jumper.list';
const LOCAL_STORAGE_SELECTED_JUMPER_KEY = 'jumper.selectedId';
const jumperListContainer = document.querySelector('[data-jumper-list]');
const newJumperForm = document.querySelector('[data-new-jumper-form');
const newJumperInput = document.querySelector('[data-new-jumper-input');
const deleteJumperButton = document.querySelector('[data-delete-jumper');


let jumperList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JUMPER_LIST_KEY)) || [];
let selectedJumperId = localStorage.getItem(LOCAL_STORAGE_SELECTED_JUMPER_KEY);

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

renderJumpers();