export class Project {
    #name;
    #tasks;
    #color;
    static instances = [];

    constructor({uuid, name, color}){
        this.uuid = uuid || crypto.randomUUID(); 
        const finalName = name || "";
        this.#name = finalName.toLowerCase();
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

    static deleteProject(projectUuid) {
        const index = Project.instances.findIndex((p) => p.uuid === projectUuid);
        if (index !== -1) {
            Project.instances.splice(index, 1);
        }
    }

    static findProject(projectName) {
        return Project.getAllProjects().find(proj => proj.name === projectName);
    }

    static findProjectOfTask(taskId) {
        return Project.getAllProjects().find(proj => proj.tasks.some(task => task.uuid === taskId));
    }

    static findTask(taskUuid){
        for (const proj of Project.getAllProjects()) {
            const foundTask = proj.tasks.find(task => task.uuid === taskUuid);
            if (foundTask) return foundTask;
        }
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