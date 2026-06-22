import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { loadApplicationState } from "./load.js";
import highPriorityIcon from "./images/gui-high-priority-svgrepo-com.svg";
import mediumPriorityIcon from "./images/gui-medium-priority-svgrepo-com.svg";
import lowPriorityIcon from "./images/gui-low-priority-svgrepo-com.svg";
import { determineFormat } from "./date.js";

export function Display() {
    const renderTaskCards = () => {
        const taskList = Project.getAllProjects().flatMap(proj => proj.tasks);
        const tasksContainer = document.querySelector(".tasks-container");
        
        taskList.forEach(t => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");

            const title = document.createElement("h3");
            title.textContent = t.title;
            title.classList.add("task-title");

            const priorityIcon = document.createElement("img");
            const priorityObj = renderPriorityIcon(t.priority);
            priorityIcon.src = priorityObj.iconUrl;
            priorityIcon.alt = priorityObj.iconAlt;
            priorityIcon.classList.add("priority-icon");
            const topDiv = document.createElement("div");
            topDiv.classList.add("top-div");
            topDiv.append(title, priorityIcon);

            taskCard.appendChild(topDiv)
            const formattedDate = determineFormat(t.dueDate);
            if (formattedDate == undefined) {
            } else {
                const dueDateDiv = document.createElement("div");
                dueDateDiv.classList.add("task-due");
                const dueDate = document.createElement("p");
                dueDate.textContent = formattedDate;
                dueDateDiv.appendChild(dueDate);
                taskCard.appendChild(dueDateDiv);
            }
            tasksContainer.appendChild(taskCard);
        })
    }

    const renderPriorityIcon = (priorityLevel) => {
        if (!priorityLevel) return;
        let iconUrl;
        let iconAlt;
        if (priorityLevel === "High") {
            return { iconUrl: highPriorityIcon, iconAlt: "White exclamation mark inside a red diamond" };
        } else if (priorityLevel === "Medium") {
            return { iconUrl: mediumPriorityIcon, iconAlt: "Black ellipsis inside a yellow diamond" };
        } else {
            return { iconUrl: lowPriorityIcon, iconAlt: "Yellow down arrow inside a green diamond" };
        }
    }

    const renderProjectBtn = () => {
        loadApplicationState();
        const projList = Project.getAllProjects();
        for (let i = 0; i < projList.length; i++) {
            const projName = projList[i].name;
            createProjectBtn(projName);
        }
    }

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

    return { renderProjectBtn, renderTaskCards, createChecklistElement, createProjectBtn, };
}

function Controller() {
    const display = Display();

    display.renderProjectBtn();
    display.renderTaskCards();

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