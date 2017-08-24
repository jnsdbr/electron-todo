'use strict'

const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database(':memory:')
const TodoManager = require('./TodoManager')

// Keep a global reference of the mainWindowdow object, if you don't, the mainWindowdow will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let todoMngr

function createMainWindow ()
{
    let menu

    // Create the browser mainWindowdow.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the mainWindowdow is closed.
    mainWindow.on('closed', () => {
        db.close()
        // Dereference the mainWindowdow object, usually you would store mainWindowdows
        // in an array if your app supports multi mainWindowdows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    db.serialize(function() {
        db.run("CREATE TABLE todos (info TEXT)")

        var stmt = db.prepare("INSERT INTO todos VALUES (?)")
        for (var i = 0; i < 5; i++) {
            stmt.run("Ipsum " + i)
        }
        stmt.finalize()

        todoMngr = new TodoManager(db)
    })

    var application_menu = [{
        label: 'File',
        submenu: [{
                label: 'New',
                accelerator: 'Command+N',
                role: 'new',
                click: () => {
                    mainWindow.webContents.send('new');
                }
            }
        ]
    }];

    if (process.platform == 'darwin') {
        const name = app.getName();
        application_menu.unshift({
            label: name,
            submenu: [{
                label: 'About ' + name,
                role: 'about'
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                role: 'services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                role: 'hideothers'
            }, {
                label: 'Show All',
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => { app.quit(); }
            }]
        });
     }

     //menu = Menu.buildFromTemplate(application_menu);
     //Menu.setApplicationMenu(menu);
}

exports.getTodos = function() {
    return todoMngr.getTodos()
}

exports.add = arg => {
    todoMngr.addTodo(arg)
}

exports.update = arg => {
    todoMngr.updateTodo(arg.id, arg.value)
}

exports.remove = arg => {
    todoMngr.removeTodo(arg)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser mainWindowdows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)

// Quit when all mainWindowdows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a mainWindowdow in the app when the
    // dock icon is clicked and there are no other mainWindowdows open.
    if (mainWindow === null)
    {
        createmainWindowdow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
