import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { loadApplicationState } from "./load.js";
import highPriorityIcon from "./images/gui-high-priority-svgrepo-com.svg";
import mediumPriorityIcon from "./images/gui-medium-priority-svgrepo-com.svg";
import lowPriorityIcon from "./images/gui-low-priority-svgrepo-com.svg";
import calendarIcon from "./images/calendar-svgrepo-com.svg";
import menuIcon from "./images/align-justify-svgrepo-com.svg";
import { determineFormat } from "./date.js";

export function Display() {
    const renderTaskCards = (onDeleteChecklistItem) => {
        const taskList = Project.getAllProjects().flatMap(proj => proj.tasks);
        const tasksContainer = document.querySelector(".tasks-container");

        taskList.forEach(t => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
            
            const taskForm = document.createElement("form");
            taskForm.id = "existingTaskForm";
            taskForm.method = "get";
            
            const titleInput = document.createElement("input");
            titleInput.classList.add("title");
            titleInput.value = t.title;
            titleInput.dataset.uuid = t.uuid;
            titleInput.classList.add("taskTitle");
            titleInput.name = "taskTitle";
            titleInput.type = "text";
            
            const topDiv = document.createElement("div");
            topDiv.classList.add("top-div");

            const priorityObj = renderPriorityIcon(t.priority);
            if (priorityObj) {
                const priorityIcon = document.createElement("img");
                priorityIcon.src = priorityObj.iconUrl;
                priorityIcon.alt = priorityObj.iconAlt;
                priorityIcon.classList.add("priority-icon");
                topDiv.append(titleInput, priorityIcon);
            } else {
                topDiv.append(titleInput);
            }

            const descInput = document.createElement("textarea");
            descInput.classList.add("description");
            descInput.dataset.uuid = t.uuid;
            descInput.value = t.description;
            descInput.id = "taskDesc";
            descInput.name = "taskDesc";

            const checklistItems = t.checklist;
            const currChecklistUl = document.createElement("ul");
            currChecklistUl.classList.add("checklist");
            checklistItems.forEach(item => {
                createChecklistElement(currChecklistUl, item, (itemId, li) => onDeleteChecklistItem(itemId, li, t));
            })
            const addNewBtn = document.createElement("button");
            addNewBtn.classList.add("addBtn");
            addNewBtn.textContent = "+";
            addNewBtn.type = "button";
            
            const formattedDate = determineFormat(t.dueDate);
            const dueDateDiv = document.createElement("div");
            const calendarImg = document.createElement("img");
            calendarImg.src = calendarIcon;
            calendarImg.alt = "Ring-bound calendar";
            calendarImg.classList.add("calendar-icon");
            dueDateDiv.classList.add("dueDate");
            const dueDateInput = document.createElement("input");
            dueDateInput.type = "date";
            dueDateInput.name = "taskDueDate";
            dueDateInput.dataset.uuid = t.uuid;
            dueDateInput.value = t.dueDate;
            const dueDateLabel = document.createElement("p");
            dueDateLabel.textContent = formattedDate
            dueDateDiv.append(calendarImg, dueDateInput, dueDateLabel);

            taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv)
            taskCard.appendChild(taskForm);
            tasksContainer.appendChild(taskCard);

            const formInputs = [titleInput, descInput, dueDateInput];
            formInputs.forEach(input => {
                input.addEventListener("input", (event) => {
                    const targetUuid = event.target.dataset.uuid;
                    const editedTask = taskList.find(t => t.uuid === targetUuid);
                    const taskKey = event.target.classList[0];
                    editedTask.editTask(taskKey, event.target.value);
                    if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
                })
            })
        })
        const taskCards = document.querySelectorAll(".task-card");
        taskCards.forEach(card => card.addEventListener("click", (event) => {
            event.target.classList.add("active");
        }));
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

    const createChecklistElement = (checklistUl, currChecklistData, onDelete) => {
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
        checklistUl.appendChild(li);
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

    const openTaskCard = () => {

    }

    return { renderProjectBtn, renderTaskCards, createChecklistElement, createProjectBtn, };
}

function Controller() {
    const display = Display();

    let checklistData = [];

    const removeChecklistItem = (itemId, li) => {
        checklistData = checklistData.filter(item => item.id !== itemId);
        li.remove();
    }

    const removeExistingChecklistItem = (itemId, li, task) => {
        task.checklist = task.checklist.filter(item => item.id !== itemId);        
        li.remove();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
    }

    display.renderProjectBtn();
    display.renderTaskCards(removeChecklistItem);

    const itemInput = document.getElementById("itemInput");
    const addBtn = document.getElementById("addBtn");

    const addChecklistItem = () => {
        const textValue = itemInput.value.trim();
        if (textValue === "") return;

        const newTaskChecklist = document.getElementById("checklist");
        const currChecklistData = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            text: textValue,
            status: "pending",
        }
        checklistData.push(currChecklistData);
        display.createChecklistElement(newTaskChecklist, currChecklistData, removeChecklistItem);
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

    const logNewInput = () => {
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
            const taskData = logNewInput();
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