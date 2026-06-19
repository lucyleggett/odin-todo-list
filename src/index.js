/* Pseudocode

--Projects will hold tasks
--Each task will be an object with the following keys: title, description, dueDate, priority, checklist
--Task creation, task editing, task deletion and task assignment (to projects) will be separated
--DOM manipulation in a single module composed of factories

*/

import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";

const groceries = new Project("Groceries");
const work = new Project("Work");
const gifts = new Project("Gifts");

function Form() {

}

function Controller() { 
    const form = document.querySelector("#newTaskForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const submitBtn = event.submitter || document.querySelector("button[type='submit']");
        const targetProjName = submitBtn.value;

        const projectsList = Project.getAllProjects();
        const targetProj = projectsList.find(proj => proj.name === targetProjName);
        console.log(targetProj);
        
        if (targetProj) {
            const taskData = logInput();
            const { title, description, dueDate, priority, checklist } = taskData;
            const newTask = new Task(title, description, dueDate, priority, checklist);
            targetProj.addTask(newTask);
        } else {
            console.log("Project not found");
        }

        console.log(Project.getAllProjects());
        form.reset();
    });

    const logInput = () => {
        const taskObj = {
            title: document.querySelector("#taskTitle").value,
            description: document.querySelector("#taskDesc").value,
            dueDate: document.querySelector("#taskDueDate").value,
            priority: document.querySelector("#taskPriority").value,
            checklist: [],
        };
        return taskObj;
    };

    const moveTask = (taskUUID, currProj, nextProj) => {
        const tasksList = currProj.getAllTasks();
        const targetTask = tasksList.find(t => t.uuid === taskUUID);
        currProj.removeTask(targetTask);
        nextProj.addTask(targetTask);
    }
}

const controller = Controller();