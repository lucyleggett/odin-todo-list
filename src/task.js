export class Task {
    static instances = [];

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

    get getAllTasks() {
        return Task.instances;
    }

    editTask(key, value) {
        if (key === "uuid") {
            console.log("No can do!")
            return;
        } this[key] = value;
    }
}
