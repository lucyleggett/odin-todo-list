import { Task } from "./task.js";
import { Project } from "./project.js";
import highPriorityIcon from "./images/gui-high-priority-svgrepo-com.svg";
import mediumPriorityIcon from "./images/gui-medium-priority-svgrepo-com.svg";
import lowPriorityIcon from "./images/gui-low-priority-svgrepo-com.svg";
import calendarIcon from "./images/calendar-svgrepo-com.svg";
import menuIcon from "./images/align-justify-svgrepo-com.svg";
import brushIcon from "./images/brush-tool-svgrepo-com.svg";
import binIcon from "./images/trash-svgrepo-com.svg";
import { addDeleteProjListener, addEditTaskListener, addEditProjListener, addListener, addEditChecklistListener, addDeleteChecklistItemListener, addNewProjectBtnListener, addNewTaskBtnListener } from "./event.js";
import { updateDateDisplay } from "./date.js";

export function Display() {
    const setCardColor = (card) => {
        const currProj = Project.getAllProjects().find((p) => p.uuid === card.dataset.id);
        
        if (currProj && currProj.color) {
            card.style.backgroundColor = currProj.color;
        } else {
            const localPicker = card.querySelector(".hidden-color-picker");
            if (localPicker) {
                card.style.backgroundColor = localPicker.value;
            } else {
                card.style.backgroundColor = "inherit";
            }
        }
    }

    const renderProjectCard = (projectData = null) => {
        const projContainer = document.querySelector(".projects-container");
        const projCard = document.createElement("div");
        projCard.classList.add("project-card");

        if (projectData) {
            projCard.dataset.id = projectData.uuid;
        }

        const projForm = document.createElement("form");
        projForm.classList = "new-project-form";
        projForm.addEventListener("submit", (e) => e.preventDefault());

        const inputWrap = document.createElement("div");
        inputWrap.classList.add("input-wrap");

        const projTitleMirror = document.createElement("span")
        projTitleMirror.classList.add("proj-title-mirror");

        const projTitle = document.createElement("input");
        projTitle.type = "text";
        projTitle.placeholder = "Title";
        projTitle.size = 1;
        projTitle.classList.add("proj-title");

        if (projectData) projTitle.value = projectData.name;
        projTitleMirror.textContent = projTitle.value || projTitle.placeholder;

        projTitle.addEventListener("input", () => {
            projTitleMirror.textContent = projTitle.value || projTitle.placeholder;
        })

        const projectIdentifier = projectData ? projectData.uuid : Math.random().toString(36).substr(2, 9);
        const uniqueID = `color-picker-${projectIdentifier}`;

        const taskCount = document.createElement("p");
        taskCount.textContent = "n tasks";
        taskCount.classList.add("task-count");

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon-container");

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.id = uniqueID;
        colorPicker.name = "color";
        colorPicker.classList.add("hidden-color-picker");
        colorPicker.setAttribute("list", "presetColors" + uniqueID);

        const colorPickerLabel = document.createElement("label");
        colorPickerLabel.setAttribute("for", uniqueID);
        colorPickerLabel.classList.add("color-picker-label");

        const colorPickerIcon = document.createElement("img");
        colorPickerIcon.src = brushIcon;
        colorPickerIcon.classList.add("brush", "icon");

        const colorPalette = ["#3E8235", "#7E5CBC", "#C6246E", "#1C2C82", "#CE350E"];

        const datalist = document.createElement("datalist");
        datalist.id = "presetColors" + `${uniqueID}`;
        colorPalette.forEach((color) => {
            const option = document.createElement("option");
            option.value = color;
            datalist.appendChild(option);
        })

        if (projectData) {
            colorPicker.value = projectData.color;
        } else {
            colorPicker.value = colorPalette[0];
        }

        colorPickerLabel.appendChild(colorPickerIcon);

        const deleteProjBtn = document.createElement("button");
        deleteProjBtn.classList.add("delete-btn");
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete", "icon");
        deleteIcon.src = binIcon;

        if (projectData) {
            deleteProjBtn.dataset.uuid = projectData.uuid;
        }
        
        deleteProjBtn.appendChild(deleteIcon);
        addDeleteProjListener(deleteProjBtn, projCard);

        inputWrap.append(projTitleMirror, projTitle);
        iconDiv.append(colorPickerLabel, colorPicker, datalist, deleteProjBtn);
        projForm.append(inputWrap, taskCount, iconDiv);
        projCard.appendChild(projForm);
        setCardColor(projCard);
        addEditProjListener(projCard, { setCardColor });
        projContainer.appendChild(projCard);
    }

    const renderTaskCard = (taskData = null, parentProject = null) => {
        const tasksContainer = document.querySelector(".tasks-container");
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        if (taskData) {
            taskCard.dataset.uuid = taskData.uuid;
        }

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
        if (taskData) {
            currChecklistUl.dataset.uuid = taskData.uuid;
        }
        currChecklistUl.classList.add("checklist");

        if (taskData && taskData.checklist && taskData.checklist.length > 0) {
            taskData.checklist.forEach(item => {
                createChecklistElement(currChecklistUl, item)
            });
        } else {
            createChecklistElement(currChecklistUl, {});
        }

        const addNewBtn = document.createElement("button");
        addNewBtn.classList.add("add-btn");
        addNewBtn.textContent = "+";
        addNewBtn.type = "button";

        addNewBtn.addEventListener("click", (event) => {
            event.preventDefault();
            createChecklistElement(currChecklistUl, {});
        });
            
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList.add("due-date");

        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.classList.add("custom-date");
        dueDateInput.name = "taskDueDate";

        if (taskData) {
            dueDateInput.value = taskData.dueDate;
            dueDateInput.dataset.uuid = taskData.uuid;
        }
        updateDateDisplay(dueDateInput);
        dueDateInput.addEventListener("change", () => {
            updateDateDisplay(this);
        })

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
            taskCard.dataset.id = parentProject.uuid;
            setCardColor(taskCard);
        } else {
            const defaultProj = Project.getAllProjects().find(proj => proj.name === projectInput.value);
            if (defaultProj) {
                taskCard.dataset.id = defaultProj.uuid;
                setCardColor(taskCard);
            }
        }

        dueDateDiv.append(dueDateInput, projectInput);

        taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv);
        taskCard.appendChild(taskForm);
        tasksContainer.appendChild(taskCard);

        addEditTaskListener(taskCard, { setCardColor });
    }

    const createChecklistElement = (checklistUl, currChecklistData) => {
        const li = document.createElement("li");
        if (currChecklistData.id) li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        label.classList.add("checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checklist-checkbox");

        const checklistInput = document.createElement("input");
        checklistInput.type = "text";
        checklistInput.classList.add("checklist-input");
        checklistInput.placeholder = "Add to checklist...";
        checklistInput.value = currChecklistData.text || "";

        if (currChecklistData.status === "completed") {
            checkbox.checked = true;
            checklistInput.classList.add("checked");
        }

        const deleteItemBtn = document.createElement("button");
        deleteItemBtn.textContent = "x";
        deleteItemBtn.classList.add("checklist-delete");
 
        label.append(checkbox, checklistInput);
        li.append(label, deleteItemBtn);
        checklistUl.appendChild(li);
        addEditChecklistListener(checklistUl);
        addDeleteChecklistItemListener(checklistUl);
    }

    return { setCardColor, renderProjectCard, renderTaskCard, createChecklistElement };
}
