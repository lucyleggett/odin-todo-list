/* Pseudocode

--Projects will hold tasks
--Each task will be an object with the following keys: title, description, dueDate, priority, checklist
--Task creation, task editing, task deletion and task assignment (to projects) will be separated
--DOM manipulation in a single module composed of factories

*/

import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";

// function printExampleTask() {
//     const exampleTask = new Task("Buy milk", "Semi-skimmed", "Tomorrow", "Low", true);
//     console.log(exampleTask.details);
// }

// function printExampleProject() {
//     const exampleProject = new Project("Shopping");
//     console.log(exampleProject.name);
//     exampleProject.name = "Groceries";
//     console.log(exampleProject.name);
// }

const exampleTask = new Task("Buy milk", "Semi-skimmed", "Tomorrow", "Low", []);
const exampleProject = new Project("Shopping");
exampleProject.addTask(exampleTask);
console.log(exampleProject.tasks);

exampleProject.removeTask(exampleTask);
console.log(exampleProject.tasks);

exampleTask.editTask("priority", "High");
console.log(exampleTask.details);