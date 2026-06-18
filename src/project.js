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