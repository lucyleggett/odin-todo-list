import "./style.css";
import { loadApplicationState } from "./load.js";
import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";

const groceries = new Project("Groceries");
const work = new Project("Work");
const gifts = new Project("Gifts");

function Display() {
    const createChecklistElement = (currChecklistData, itemInput) => {
        const checklist = document.getElementById("checklist");
        const li = document.createElement("li");
        li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textSpan = document.createElement("span");
        textSpan.textContent = textValue;

        const deleteItemBtn = document.createElement("button");
        deleteItemBtn.textContent = "X";
        deleteItemBtn.classList.add("checklist-delete");
        deleteItemBtn.addEventListener("click", () => removeChecklistItem(currChecklistData.id, li));
 
        label.append(checkbox, textSpan);
        li.append(label, deleteItemBtn);
        checklist.appendChild(li);

        itemInput.value = "";
        itemInput.focus();
    }
}

function Controller() {
    loadApplicationState();

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
        display.createChecklistElement(currChecklistData, itemInput);
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

    const newProjectBtn = document.querySelector("#newProjectBtn");
    newProjectBtn.addEventListener("click", (event) => {
        event.preventDefault()
        const newProject = document.querySelector("#projectName").value;
        if (!newProject) return;
        new Project(newProject);
    })
    
    const newTaskForm = document.querySelector("#newTaskForm");
    if (!newTaskForm) return;
    newTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const submitBtn = event.submitter || document.querySelector("button[type='submit']");
        createNewTask(submitBtn);
        checklist.replaceChildren();
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
        const targetProj = projectsList.find(proj => proj.name === targetProjName);
        
        if (targetProj) {
            const taskData = logInput();
            const { title, description, dueDate, priority, checklist } = taskData;
            const newTask = new Task(title, description, dueDate, priority, checklist);
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