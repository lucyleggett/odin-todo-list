export class Project {
    #name;
    #tasks;
    static instances = [];

    constructor(name, color){
        this.name = name.toLowerCase();
        this.color = color;
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

    toJSON() {
        return {
            name: this.#name,
            tasks: this.#tasks
        };
    }

    static moveTask(taskUUID, currProj, nextProj) {
        const tasksList = currProj.tasks;
        const targetTask = tasksList.find(t => t.uuid === taskUUID);
        currProj.removeTask(targetTask);
        nextProj.addTask(targetTask);
    }
}