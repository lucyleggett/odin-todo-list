export {  }

export class Project {
    #name;
    #tasks

    constructor(name){
        this.name = name;
        this.#tasks = [];
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        this.#name = newName;
    }

    get tasks() {
        return this.#tasks;
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    removeTask(task) {
        this.#tasks = this.#tasks.filter(t => t.uuid !== task.uuid);
    }
}

export class Task {
    constructor(title, description, dueDate, priority, checklist) {
        this.uuid = crypto.randomUUID(); 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }

    get details() {
        return { 
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            checklist: this.checklist,
        }
    }

    editTask(property) {

    }
}
