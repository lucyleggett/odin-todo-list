export { printExampleTask, printExampleProject }
class Project {
    #name;

    constructor(name){
        this.name = name;
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        this.#name = newName;
    }
}

class Task {
    constructor(title, description, dueDate, priority, checklist) {
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

    addTask(task) {

    }

    editTask(property) {

    }
}
 
function printExampleTask() {
    const exampleTask = new Task("Buy milk", "Semi-skimmed", "Tomorrow", "Low", true);
    console.log(exampleTask.details);
}

function printExampleProject() {
    const exampleProject = new Project("Shopping");
    console.log(exampleProject.name);
    exampleProject.name = "Groceries";
    console.log(exampleProject.name);
}
