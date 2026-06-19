import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";

const groceries = new Project("Groceries");
const work = new Project("Work");
const gifts = new Project("Gifts");

function Form() {

}

function Controller() { 
    const itemInput = document.getElementById("itemInput");
    const addBtn = document.getElementById("addBtn");
    const checklist = document.getElementById("checklist");
    const checklistData = [];

    const addChecklistItem = () => {
        const textValue = itemInput.value.trim();
        
        if (textValue === "") return;
        checklistData.push(textValue);
        console.log("Checklist array:", checklistData);

        const li = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const textSpan = document.createElement("span");
        textSpan.textContent = textValue;

        label.append(checkbox, textSpan);
        li.appendChild(label);
        checklist.appendChild(li);

        itemInput.value = "";
        itemInput.focus();
    }

    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addChecklistItem();
    });

    itemInput.addEventListener("keypress", (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addChecklistItem();
        }
    });

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
            checklist: checklistData,
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