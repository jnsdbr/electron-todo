class Todo {
    constructor(id, todo) {
        this.id = id
        this.todo = todo
    }
}

class TodoManager {
    constructor(db) {
        this.db = db
        this.todos = new Array
        this.loadFromDB()
        this.todosLoaded = false;
    }
    loadFromDB() {
        var self = this;
        this.db.each("SELECT rowid AS id, info FROM todos", function(err, row) {
            self.todos.push(new Todo(row.id, row.info))
        });
        this.todosLoaded = true;
    }
    getTodos() {
        return this.todos
    }
    getTodoIndexById(id) {
        for (var i = 0; i < this.todos.length; i++) {
            if (this.todos[i].id == id) {
                return i
            }
        }
    }
    addTodo(todo) {
        var self = this
        this.db.run("INSERT INTO todos VALUES (?)", [todo], function(error) {
            if (error != null)
                console.log(error)
        })

        // @TODO this is not cool
        // Clear todos and reload
        this.todos = []
        this.db.each("SELECT rowid AS id, info FROM todos", function(err, row) {
            self.todos.push(new Todo(row.id, row.info))
        });
    }
    updateTodo(id, value) {
        var index = this.getTodoIndexById(id);
        if (index != undefined && index >= 0)
        {
            this.todos[index].todo = value

            this.db.run("UPDATE todos SET info=(?) WHERE rowid=(?)", [value, id], function(error) {
                if (error != null)
                    console.log(error)
            })
        }
    }
    removeTodo(id) {
        var index = this.getTodoIndexById(id)
        this.todos.splice(index, 1);

        this.db.run("DELETE FROM todos WHERE rowid=(?)", [id], function(error) {
            if (error != null)
                console.log(error)
        })
    }
}

module.exports = TodoManager
