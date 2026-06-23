export class Project {
    #name;
    #tasks;
    #color;
    static instances = [];

    constructor(uuid, name, color){
        this.uuid = uuid || crypto.randomUUID(); 
        this.#name = name.toLowerCase();
        this.#color = color;
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

    get color() {
        return this.#color;
    }

    set color(newColor) {
        this.#color = newColor;
    }

    get tasks() {
        return this.#tasks;
    }

    static deleteProject(uuid) {
        const updatedProjects = Project.getAllProjects().filter((p) => p.uuid !== uuid);
        Project.instances = updatedProjects;
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    removeTask(task) {
        this.#tasks = this.#tasks.filter(t => t.uuid !== task.uuid);
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.#name,
            color: this.#color,
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