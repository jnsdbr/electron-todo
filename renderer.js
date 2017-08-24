var {ipcRenderer, remote} = require('electron')
var main = remote.require("./index.js")

const addButton = document.getElementById('add')
const todoContainer = document.getElementById('todos')

addButton.addEventListener('click', addHandler)

function populateTodos() {
    let todos = main.getTodos()
    for (let todo of todos) {
        var li = document.createElement('li')
        li.innerHTML = '<input type="text" value="' + todo.todo + '" disabled></input><div class="modify" data-action="edit" data-id="' + todo.id + '">Edit</div><div class="delete" data-id="' + todo.id + '">Delete</div>';

        // Add click listener to the delete button
        li.querySelector('.delete').addEventListener('click', deleteHandler)
        li.querySelector('.modify').addEventListener('click', modifyHandler)
        todoContainer.appendChild(li)
    }
}

function deleteHandler(event) {
    this.removeEventListener('click', false)
    main.remove(this.dataset.id)
    this.parentNode.parentNode.removeChild(this.parentNode)
}

function addHandler(event) {
    var li = document.createElement('li')
    li.innerHTML = '<input type="text"></input><div class="modify" data-action="save">Save</div><div class="delete">Delete</div>';

    // Add click listener to the delete button
    li.querySelector('.delete').addEventListener('click', deleteHandler)
    li.querySelector('.modify').addEventListener('click', modifyHandler)

    todoContainer.appendChild(li)
    li.querySelector('input').focus()
}

function modifyHandler(event) {
    var li = this.parentNode

    if (this.dataset.action == 'save') {
        this.innerHTML = 'Edit'
        this.dataset.action = 'edit'
        li.querySelector('input').disabled = true;
        main.add(li.querySelector('input').value);
    }
    else if (this.dataset.action == 'edit') {
        this.innerHTML = 'Update'
        this.dataset.action = 'update'
        li.querySelector('input').disabled = false;
        li.querySelector('input').focus()
    }
    else if (this.dataset.action == 'update') {
        this.innerHTML = 'Edit'
        this.dataset.action = 'edit'
        li.querySelector('input').disabled = true;
        main.update({id: li.querySelector('.modify').dataset.id, value: li.querySelector('input').value});
    }
}

ipcRenderer.on('new', (event, arg) => {
    addHandler()
});

document.addEventListener('DOMContentLoaded', function () {
    populateTodos()
});
