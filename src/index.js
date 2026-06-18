/* Pseudocode

--Projects will hold tasks
--Each task will be an object with the following keys: title, description, dueDate, priority, checklist
--Task creation, task editing, task deletion and task assignment (to projects) will be separated
--DOM manipulation in a single module composed of factories

*/

import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";

function Form() {

}

function Controller() { 
    const form = document.querySelector("#newTaskForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const submitButton = event.submitter || document.querySelector("button[type='submit']");
        const targetProjName = submitButton.value;

        const projectsList = Project.getAllProjects();
        const targetProj = projectsList.find(proj => proj.name === targetProjName);
        
        if (targetProj) {
            const taskData = logInput();
            const newTask = new Task(taskData);
            targetProj.addTask(newTask);
        }

        form.reset();
    });

    const logInput = () => {
        return {
            title: document.querySelector("#taskTitle").value,
            desc: document.querySelector("#taskDesc").value,
            dueDate: document.querySelector("#taskDueDate").value,
            priority: document.querySelector("#taskPriority").value,
            checklist: [],
        };
    };

    const moveTask = (task, currProj, nextProj) => {
        currProj.removeTask(task);
        nextProj.addTask(task);
    }
}
