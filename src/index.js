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
import brushIcon from "./images/brush-tool-svgrepo-com.svg";
import binIcon from "./images/trash-svgrepo-com.svg";
import { addCalendarListener } from "./date.js";
import { addDeleteProjListener, addEditProjListener, addEditTaskListener, addResizeInputListener } from "./event.js";

export function Display() {
    const resizeInput = (input) => {
        const charCount = input.value.length || 1;
        const estimatedCharWidth = 11 + 2;
        const finalWidth = (charCount * estimatedCharWidth) + 8;
        input.style.width = finalWidth + "px";
    }

    const setCardColor = (card) => {
        const currProj = Project.getAllProjects().find((p) => p.uuid === card.id);
        if(!currProj || !currProj.color) {
            card.style.backgroundColor = "inherit";
            return;
        } else {
            card.style.backgroundColor = currProj.color;
        }
    }

    const renderProjectCard = (projectData = null) => {
        const projContainer = document.querySelector(".projects-container");
        const projCard = document.createElement("div");
        projCard.classList.add("project-card");

        if (projectData) {
            projCard.id = projectData.uuid;
        }

        const projForm = document.createElement("form");
        projForm.classList = "new-project-form";
        const projTitle = document.createElement("input");
        projTitle.type = "text";
        projTitle.placeholder = "Title";
        projTitle.classList.add("proj-title");

        if (projectData) {
            projTitle.value = projectData.name;
        }

        const projectIdentifier = projectData ? projectData.uuid : Math.random().toString(36).substr(2, 9);
        const uniqueID = `color-picker-${projectIdentifier}`;

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon-container");

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.id = uniqueID;
        colorPicker.name = "color";
        colorPicker.classList.add("hidden-color-picker");
        colorPicker.setAttribute("list", "presetColors");

        const colorPickerLabel = document.createElement("label");
        colorPickerLabel.setAttribute("for", uniqueID);
        colorPickerLabel.classList.add("color-picker-label");

        const colorPickerIcon = document.createElement("img");
        colorPickerIcon.src = brushIcon;
        colorPickerIcon.classList.add("brush", "icon");

        const colorPalette = ["#5E3082", "#C92C71", "#9ED572"];
        const datalist = document.createElement("datalist");
        datalist.id = "presetColors";
        colorPalette.forEach((color) => {
            const option = document.createElement("option");
            option.value = color;
            datalist.appendChild(option);
        })

        if (projectData) {
            colorPicker.value = projectData.color;
        }
        setCardColor(projCard);

        colorPickerLabel.appendChild(colorPickerIcon);

        const deleteProjBtn = document.createElement("button");
        deleteProjBtn.classList.add("delete-btn");
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete", "icon");
        deleteIcon.src = binIcon;

        if (projectData) {
            deleteProjBtn.uuid = projectData.uuid;
        }
        
        deleteProjBtn.appendChild(deleteIcon);
        addDeleteProjListener(deleteProjBtn);

        iconDiv.append(colorPickerLabel, colorPicker, datalist, deleteProjBtn);
        projForm.append(projTitle, iconDiv);
        projCard.appendChild(projForm);
        addEditProjListener(projCard);
        projContainer.appendChild(projCard);
        document.querySelectorAll("input.proj-title").forEach(input => {
            resizeInput(input);
            addResizeInputListener(input);
        });
    }

    const renderTaskCard = (taskData = null, parentProject = null, onDeleteChecklistItem) => {
        const tasksContainer = document.querySelector(".tasks-container");
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        const taskForm = document.createElement("form");
        taskForm.method = "get";

        const topDiv = document.createElement("div");
        topDiv.classList.add("top-div");
        
        const titleInput = document.createElement("textarea");
        titleInput.classList.add("task-title");
        titleInput.name = "task-title";
        titleInput.rows = 1;
        titleInput.placeholder = "Title";
        titleInput.required = true;
        
        const priorityInput = document.createElement("select");
        priorityInput.classList.add("priority-input");
        priorityInput.required = true;
        const priorityOptions = [
            {
                level: "low",
                emoji: "⬇",
            },
            {
                level: "medium",
                emoji: "⚠️",
            },
            {
                level: "high",
                emoji: "🚩",
            }
        ]
        priorityOptions.forEach(option => {
            const priorityOption = document.createElement("option");
            priorityOption.value = option.level;
            priorityOption.textContent = option.emoji;
            priorityInput.appendChild(priorityOption);
        })

        if (taskData) {
            titleInput.value = taskData.title;
            titleInput.dataset.uuid = taskData.uuid;
            priorityInput.value = taskData.priority;
        }
        topDiv.append(titleInput, priorityInput);

        const descInput = document.createElement("textarea");
        descInput.classList.add("task-description");
        descInput.name = "taskDesc";
        descInput.rows = 1;
        descInput.placeholder = "Description";

        if (taskData) {
            descInput.value = taskData.description;
            descInput.dataset.uuid = taskData.uuid;
        }

        const currChecklistUl = document.createElement("ul");
        currChecklistUl.dataset.uuid = taskData.uuid;
        currChecklistUl.classList.add("checklist");

        if (taskData && taskData.checklist) {
            taskData.checklist.forEach(item => {
                createChecklistElement(currChecklistUl, item, (itemId, li) => onDeleteChecklistItem(itemId, li, taskData));
            })
        } else {
            createChecklistElement(currChecklistUl, {});
        }

        const addNewBtn = document.createElement("button");
        addNewBtn.classList.add("addBtn");
        addNewBtn.textContent = "+";
        addNewBtn.type = "button";
            
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList.add("due-date");

        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.classList.add("custom-date");
        dueDateInput.name = "taskDueDate";

        if (taskData) {
            dueDateInput.value = taskData.dueDate;
            dueDateInput.dataset.uuid = taskData.uuid;
        } else {
            dueDateInput.placeholder = "No deadline";
        };

        const projectInput = document.createElement("select");
        projectInput.classList.add("project-label");
        projectInput.required = true;

        Project.getAllProjects().forEach(proj => {
            const option = document.createElement("option");
            option.value = proj.name;
            option.textContent = proj.name;
            projectInput.appendChild(option);
        });

        if (parentProject) {
            projectInput.value = parentProject.name;
            taskCard.id = parentProject.uuid;
            setCardColor(taskCard);
        } else {
            const defaultProj = Project.getAllProjects().find(proj => proj.name === projectInput.value);
            if (defaultProj) {
                taskCard.id = defaultProj.uuid;
                setCardColor(taskCard);
            }
        }

        dueDateDiv.append(dueDateInput, projectInput);

        taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv);
        taskCard.appendChild(taskForm);
        tasksContainer.appendChild(taskCard);

        addEditTaskListener(taskCard);
    }

    const createChecklistElement = (checklistUl, currChecklistData, onDelete) => {
        const li = document.createElement("li");
        li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        label.classList.add("checkbox");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textSpan = document.createElement("span");
        if (currChecklistData.text === "") {
            textSpan.textContent = "";
        } else {
            textSpan.textContent = currChecklistData.text;
        }

        const deleteItemBtn = document.createElement("button");
        deleteItemBtn.textContent = "x";
        deleteItemBtn.classList.add("checklist-delete");
        deleteItemBtn.addEventListener("click", () => onDelete(currChecklistData.id,li));
 
        label.append(checkbox, textSpan);
        li.append(label, deleteItemBtn);
        checklistUl.appendChild(li);
    }

    const initializeTasks = () => {
        Project.getAllProjects().forEach(proj => {
                renderProjectCard(proj);
            });
    }

    const initializeProjects = () => {
        Project.getAllProjects().forEach(proj => {
            proj.tasks.forEach(task => {
                renderTaskCard(task, proj, removeExistingChecklistItem);
            });
        });
    }

    return { setCardColor, resizeInput, renderProjectCard, renderTaskCard, createChecklistElement, initializeTasks, initializeProjects };
}

function Controller() {
    loadApplicationState();

    const display = Display();
    let checklistData = [];

    document.querySelector("button.new-task").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderTaskCard(null, null, removeExistingChecklistItem);
    })

    document.querySelector("button.new-project").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderProjectCard(null);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    })

    display.initializeTasks();
    display.initializeProjects();

    const itemInput = document.getElementById("itemInput");
    const addBtn = document.getElementById("addBtn");

    const addChecklistItem = () => {
        if (!itemInput) return;
        const textValue = itemInput.value.trim();
        if (textValue === "") return;

        const newTaskChecklist = document.getElementById("checklist-one");
        const currChecklistData = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            text: textValue,
            status: "pending",
        }
        checklistData.push(currChecklistData);
        display.createChecklistElement(newTaskChecklist, currChecklistData, removeChecklistItem);
    }

    if (addBtn) {
        addBtn.addEventListener("click", (event) => {
            event.preventDefault();
            addChecklistItem();
        });
    }

    if (itemInput) {
        itemInput.addEventListener("keypress", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addChecklistItem();
            }
        });
    }
    
    const createNewTask = (card) => {
        const targetProjName = card.querySelector(".project-label").value;
        const targetProj = Project.getAllProjects().find(proj => proj.name === targetProjName);
        
        if (targetProj) {
            const taskObj = {
                title: card.querySelector(".task-title").value,
                description: card.querySelector(".task-description").value,
                dueDate: card.querySelector(".due-date").value,
                priority: card.querySelector(".priority-input").value,
                checklist: [],
            }
            targetProj.addTask(new Task(taskObj));
        };
    }

    addCalendarListener();
}

const controller = Controller();