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
import { addDeleteProjListener, addEditProjListener, addEditTaskListener, addMoveTaskListener, addResizeInputListener } from "./event.js";

export function Display() {
    const resizeInput = (input) => {
        const charCount = input.value.length || 1;
        const estimatedCharWidth = 11 + 2;
        const finalWidth = (charCount * estimatedCharWidth) + 8;
        input.style.width = finalWidth + "px";
    }

    const setCardColor = (card) => {
        const currProj = Project.getAllProjects().find((p) => p.uuid === card.id);
        if(!currProj || currProj.color === undefined) {
            card.style.backgroundColor = "inherit";
            return;
        } else {
            card.style.backgroundColor = currProj.color;
        }
    }

    const renderBlankProjectCard = () => {
        const projContainer = document.querySelector(".projects-container");
        const projCard = document.createElement("div");
        projCard.classList.add("project-card");

        const projForm = document.createElement("form");
        projForm.classList = "new-project-form";
        const projTitle = document.createElement("input");
        projTitle.type = "text";
        projTitle.placeholder = "Title";
        projTitle.classList.add("proj-title");

        const uniqueID = `Math.random().toString(36).substr(2, 9)}`;

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
        colorPickerLabel.appendChild(colorPickerIcon);

        const deleteProjBtn = document.createElement("button");
        deleteProjBtn.classList.add("delete-btn");
        // deleteProjBtn.id = proj.uuid;
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete", "icon");
        deleteIcon.src = binIcon;
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

    const renderProjectCards = () => {
        const projContainer = document.querySelector(".projects-container");
        Project.getAllProjects().forEach((proj) => {
            const projCard = document.createElement("div");
            projCard.id = proj.uuid;
            setCardColor(projCard);
            projCard.classList.add("project-card");

            const projForm = document.createElement("form");
            projForm.classList = "new-project-form";
            const projTitle = document.createElement("input");
            projTitle.type = "text";
            projTitle.value = proj.name;
            projTitle.classList.add("proj-title");

            const uniqueID = `color-picker-${proj.id}|| Math.random().toString(36).substr(2, 9)}`;

            const iconDiv = document.createElement("div");
            iconDiv.classList.add("icon-container");
            const colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.id = uniqueID;
            colorPicker.name = "color";
            colorPicker.value = proj.color;
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
            colorPickerLabel.appendChild(colorPickerIcon);

            const deleteProjBtn = document.createElement("button");
            deleteProjBtn.classList.add("delete-btn");
            deleteProjBtn.id = proj.uuid;
            const deleteIcon = document.createElement("img");
            deleteIcon.classList.add("delete", "icon");
            deleteIcon.src = binIcon;
            deleteProjBtn.appendChild(deleteIcon);
            addDeleteProjListener(deleteProjBtn);
            iconDiv.append(colorPickerLabel, colorPicker, datalist, deleteProjBtn);

            projForm.append(projTitle, iconDiv);
            projCard.appendChild(projForm);
            projContainer.appendChild(projCard);
            document.querySelectorAll("input.proj-title").forEach(input => {
                resizeInput(input);
                addResizeInputListener(input);
            });
            document.querySelectorAll(".new-project-form").forEach(card => {
                addEditProjListener(card);
            });
        })
    }

    const renderBlankTaskCard = (onDeleteChecklistItem) => {
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
        topDiv.append(titleInput, priorityInput);

        const descInput = document.createElement("textarea");
        descInput.classList.add("task-description");
        descInput.name = "taskDesc";
        descInput.rows = 1;
        descInput.placeholder = "Description";

        const currChecklistUl = document.createElement("ul");
        currChecklistUl.classList.add("checklist");
        const firstItem = createChecklistElement(currChecklistUl, {});

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
        dueDateInput.placeholder = "No deadline";

        const projectInput = document.createElement("select");
        projectInput.classList.add("project-label");
        projectInput.required = true;
        const initValue = Project.getAllProjects()[0];
        projectInput.value = initValue;
        setCardColor(taskCard);
        Project.getAllProjects().forEach(proj => {
            const option = document.createElement("option");
            option.value = proj.name;
            option.textContent = proj.name;
            projectInput.appendChild(option);
        })
        addMoveTaskListener(projectInput, initValue);
        dueDateDiv.append(dueDateInput, projectInput);

        taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv);
        taskCard.appendChild(taskForm);
        tasksContainer.appendChild(taskCard);

        const formInputs = [titleInput, descInput, dueDateInput];
        addEditTaskListener(formInputs);
    }

    const renderTaskCards = (onDeleteChecklistItem) => {
        const taskList = Project.getAllProjects().flatMap(proj => 
            proj.tasks.map(task => ({ task, project: proj }))
        );        
        const tasksContainer = document.querySelector(".tasks-container");

        taskList.forEach(({ task: t, project: parentProject }) => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
            taskCard.id = parentProject.uuid;
            setCardColor(taskCard);
            
            const taskForm = document.createElement("form");
            taskForm.method = "get";
            
            const titleInput = document.createElement("textarea");
            titleInput.value = t.title;
            titleInput.dataset.uuid = t.uuid;
            titleInput.classList.add("task-title");
            titleInput.name = "task-title";
            titleInput.rows = 1;
            
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
            descInput.name = "taskDesc";
            descInput.rows = 1;

            const checklistItems = t.checklist || [];
            const currChecklistUl = document.createElement("ul");
            currChecklistUl.classList.add("checklist");
            checklistItems.forEach(item => {
                createChecklistElement(currChecklistUl, item, (itemId, li) => onDeleteChecklistItem(itemId, li, t));
            })
            const addNewBtn = document.createElement("button");
            addNewBtn.classList.add("addBtn");
            addNewBtn.textContent = "+";
            addNewBtn.type = "button";
            
            const dueDateDiv = document.createElement("div");
            dueDateDiv.classList.add("dueDate");
            const dueDateInput = document.createElement("input");
            dueDateInput.type = "date";
            dueDateInput.classList.add("custom-date");
            dueDateInput.name = "taskDueDate";
            dueDateInput.dataset.uuid = t.uuid;
            dueDateInput.value = t.dueDate;

            const projectInput = document.createElement("select");
            projectInput.classList.add("project-label");
            projectInput.dataset.uuid = t.uuid;
            Project.getAllProjects().forEach(proj => {
                const option = document.createElement("option");
                option.value = proj.name;
                option.textContent = proj.name;
                projectInput.appendChild(option);
            })
            projectInput.value = parentProject.name;
            addMoveTaskListener(projectInput, parentProject);

            dueDateDiv.append(dueDateInput, projectInput);

            taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv);
            taskCard.appendChild(taskForm);
            tasksContainer.appendChild(taskCard);

            const formInputs = [titleInput, descInput, dueDateInput];
            addEditTaskListener(formInputs);
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

    const createChecklistElement = (checklistUl, currChecklistData, onDelete) => {
        const li = document.createElement("li");
        li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        label.classList.add("checkbox");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const textSpan = document.createElement("span");
        if (currChecklistData.text = "") {
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

    const createProjectBtn = (projName) => {
        const submitBtnsDiv = document.querySelector(".submit-buttons");
        const newBtn = document.createElement("button");
        newBtn.type = "submit";
        newBtn.name = "action";
        newBtn.value = `${projName}`.toLowerCase();
        newBtn.textContent = `${projName}`;
        submitBtnsDiv.appendChild(newBtn);
    } 

    return { setCardColor, resizeInput, renderProjectBtn, renderProjectCards, renderBlankTaskCard, renderTaskCards, createChecklistElement, createProjectBtn, renderBlankProjectCard };
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
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    }

    display.renderProjectBtn();
    display.renderProjectCards();
    display.renderTaskCards(removeExistingChecklistItem);
    addCalendarListener();

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
    
    // document.querySelector(".new-project").addEventListener("click", (event) => {
    //     event.preventDefault();

    //     const newProject = document.querySelector("#projectName").value;
    //     if (!newProject) return;
    //     new Project(newProject);
    //     console.log(Project.getAllProjects())
    //     display.createProjectBtn(newProject);
    // })

    document.querySelector("button .new-task").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderBlankTaskCard(removeExistingChecklistItem);
    })

    document.querySelector("button .new-project").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderBlankProjectCard();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
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

    const logNewTaskInput = (card) => {
        const form = card.querySelector("form");
        const taskObj = {
            title: form.querySelector(".task-title").value,
            description: form.querySelector(".task-description").value,
            dueDate: form.querySelector(".due-date").value,
            priority: form.querySelector(".priority-input").value,
            checklist: checklistData,
        };
        return taskObj;
    };

    const createNewTask = (card) => {
        const targetProjName = card.querySelector(".project-label").value;
        const targetProj = Project.getAllProjects().find(proj => proj.name === targetProjName);
        
        if (targetProj) {
            const taskData = logNewInput();
            const newTask = new Task(taskData);
            targetProj.addTask(newTask);
        };
    }
}

const controller = Controller();