export { printExampleTask, }

class Task {
    constructor(title, description, dueDate, priority, checklist){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }
}

function printExampleTask() {
    const exampleTask = new Task("Buy milk", "Semi-skimmed", "Tomorrow", "Low", true);
    console.log(exampleTask);
}
