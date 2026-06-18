export class Project {
    #name;
    #tasks
    static instances = [];

    constructor(name){
        this.name = name;
        this.#tasks = [];

        Project.instances.push(this);
    }

    static getAllProjects() {
        return Project.instances;
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