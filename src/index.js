import "./style.css";
import { renderProjectBtns } from "./load.js";
import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";

export function Display() {
    const createChecklistElement = (currChecklistData, itemInput, onDelete) => {
        const checklist = document.getElementById("checklist");
        const li = document.createElement("li");
        li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        label.classList.add("checkbox");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textSpan = document.createElement("span");
        textSpan.textContent = currChecklistData.text;

        const deleteItemBtn = document.createElement("button");
        deleteItemBtn.textContent = "x";
        deleteItemBtn.classList.add("checklist-delete");
        deleteItemBtn.addEventListener("click", () => onDelete(currChecklistData.id,li));
 
        label.append(checkbox, textSpan);
        li.append(label, deleteItemBtn);
        checklist.appendChild(li);

        itemInput.value = "";
        itemInput.focus();
    }

    const createProjectBtn = (projName) => {
        const submitBtnsDiv = document.querySelector(".submit-buttons");
        const newBtn = document.createElement("button");
        newBtn.type = "submit";
        newBtn.name = "action";
        newBtn.value = `${projName}`.toLowerCase();
        newBtn.textContent = `${projName}`;
        submitBtnsDiv.appendChild(newBtn);
    } 

    return { createChecklistElement, createProjectBtn, };
}

function Controller() {
    renderProjectBtns();

    const display = Display();
    const itemInput = document.getElementById("itemInput");
    const addBtn = document.getElementById("addBtn");
    let checklistData = [];

    const addChecklistItem = () => {
        const textValue = itemInput.value.trim();
        if (textValue === "") return;

        const currChecklistData = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            text: textValue,
            status: "pending",
        }
        checklistData.push(currChecklistData);
        display.createChecklistElement(currChecklistData, itemInput, removeChecklistItem);
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
    
    document.querySelector("#newProjectBtn").addEventListener("click", (event) => {
        event.preventDefault()
        const newProject = document.querySelector("#projectName").value;
        if (!newProject) return;
        new Project(newProject);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
        console.log(Project.getAllProjects())
        display.createProjectBtn(newProject);
    })
    
    const newTaskForm = document.querySelector("#newTaskForm");
    if (!newTaskForm) return;
    newTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const submitBtn = event.submitter || document.querySelector("button[type='submit']");
        createNewTask(submitBtn);
        document.getElementById("checklist").replaceChildren();
        checklistData = [];
        newTaskForm.reset();
    });

    const removeChecklistItem = (itemId, li) => {
        checklistData = checklistData.filter(item => item.id !== itemId);
        li.remove();
    }
            
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

    const createNewTask = (submitBtn) => {
        const targetProjName = submitBtn.value;
        const projectsList = Project.getAllProjects();
        console.log("Looking for:", targetProjName, "in:", projectsList.map(p => p.name));
        const targetProj = projectsList.find(proj => proj.name === targetProjName);
        
        if (targetProj) {
            const taskData = logInput();
            const newTask = new Task(taskData);
            targetProj.addTask(newTask);
        };
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
    }

    const moveTask = (taskUUID, currProj, nextProj) => {
        const tasksList = currProj.getAllTasks();
        const targetTask = tasksList.find(t => t.uuid === taskUUID);
        currProj.removeTask(targetTask);
        nextProj.addTask(targetTask);
    }
}

const controller = Controller();