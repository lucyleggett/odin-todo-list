import { Task } from "./task.js";
import { Project } from "./project.js";
import brushIcon from "./images/brush-tool-svgrepo-com.svg";
import checkboxIcon from "./images/checkbox-svgrepo-com.svg";
import checkedIcon from "./images/checked-checkbox-svgrepo-com.svg"
import binIcon from "./images/trash-svgrepo-com.svg"
import priorityIconRaw from "./images/circle-svgrepo-com (1).svg?raw";
import { addDeleteProjListener, addEditTaskListener, addEditProjListener, addListener, addEditChecklistListener, addDeleteChecklistItemListener, addNewProjectBtnListener, addNewTaskBtnListener, addEditPriorityListener, addEditStatusListener, addTextAreaGrowListener } from "./event.js";
import { updateDateDisplay } from "./date.js";
import { filterTasks } from "./filter.js";

export function Display() {
    const setBackgroundColor = (element) => {
        if (!element) return;
        const currProj = Project.findProjectOfTask(element.dataset.id);
        
        if (currProj && currProj.color) {
            element.style.backgroundColor = currProj.color;
        } else {
            const localPicker = element.querySelector(".hidden-color-picker");
            if (localPicker) {
                element.style.backgroundColor = localPicker.value;
            } else {
                element.style.backgroundColor = "inherit";
            }
        }
    }

    const filterMenu = document.querySelector(".filter-menu");
    const filterBtn = document.querySelector("button.filter");
    filterBtn.addEventListener("click", () => {
        filterMenu.classList.toggle("disabled");
    })

    filterMenu.querySelector(".apply-filter-btn").addEventListener("click", () => {
        filterTasks( {renderTaskCard} );
        filterMenu.classList.add("disabled");
    });

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
        setBackgroundColor(projCard);
        addEditProjListener(projCard, { setBackgroundColor });
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

        const priorityBtn = document.createElement("button");
        priorityBtn.type = "button";
        priorityBtn.classList = "priority-btn";
        priorityBtn.innerHTML = priorityIconRaw;
        priorityBtn.dataset.id = taskCard.dataset.uuid;
        const svgElement = priorityBtn.querySelector("svg");
        if (svgElement) svgElement.classList.add("priority-icon");
        
        const titleInput = document.createElement("textarea");
        titleInput.classList.add("task-title");
        titleInput.name = "task-title";
        titleInput.rows = 1;
        titleInput.placeholder = "Title";
        titleInput.required = true;
        titleInput.dataset.id = taskCard.dataset.uuid;

        const priorityColourMap = [
            { priority: "low", color: "#008002" },
            { priority: "medium", color: "#ff7300"},
            { priority: "high", color: "#ab0808" }
        ]

        if (taskData) {
            titleInput.value = taskData.title;
            const matchedPriority = priorityColourMap.find(item => item.priority === taskData.priority);
            priorityBtn.style.color = matchedPriority ? matchedPriority.color : priorityColourMap[0].color;
        }
        addEditPriorityListener(priorityBtn, priorityColourMap);

        const taskStatusBtn = document.createElement("button");
        taskStatusBtn.type = "button";
        taskStatusBtn.classList.add("task-status-btn");
        taskStatusBtn.dataset.id = taskCard.dataset.uuid;

        const taskStatusPending = document.createElement("img");
        taskStatusPending.src = checkboxIcon;
        taskStatusPending.alt = "Empty checkbox";
        taskStatusPending.classList.add("pending", "status-icon");

        const taskStatusComplete = document.createElement("img");
        taskStatusComplete.src = checkedIcon;
        taskStatusComplete.alt = "Checked checkbox";
        taskStatusComplete.classList.add("complete", "status-icon");

        if (taskData) {
            if (taskData.status === "pending") {
                taskStatusComplete.classList.add("disabled");
            } else if (taskData.status === "complete") {
                taskStatusPending.classList.add("disabled");
            }
        }

        taskStatusBtn.append(taskStatusPending, taskStatusComplete);
        addEditStatusListener(taskStatusBtn);

        topDiv.append(priorityBtn, titleInput, taskStatusBtn);

        const descInput = document.createElement("textarea");
        descInput.classList.add("task-description");
        descInput.name = "taskDesc";
        descInput.rows = 1;
        descInput.placeholder = "Description";
        descInput.dataset.id = taskCard.dataset.uuid;

        if (taskData) descInput.value = taskData.description;

        const currChecklistUl = document.createElement("ul");
        currChecklistUl.dataset.id = taskCard.dataset.uuid;
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
        dueDateInput.dataset.id = taskCard.dataset.uuid;

        if (taskData) dueDateInput.value = taskData.dueDate;

        updateDateDisplay(dueDateInput);
        dueDateInput.addEventListener("change", () => {
            updateDateDisplay(this);
        })

        const projectInput = document.createElement("select");
        projectInput.classList.add("project-label");
        projectInput.dataset.id = taskCard.dataset.uuid;

        Project.getAllProjects().forEach(proj => {
            const option = document.createElement("option");
            option.value = proj.name;
            option.textContent = proj.name;
            projectInput.appendChild(option);
        });

        if (parentProject) {
            projectInput.value = parentProject.name;
            taskCard.dataset.id = parentProject.uuid;
            setBackgroundColor(projectInput);
        } else {
            const defaultProj = Project.getAllProjects().find(proj => proj.name === projectInput.value);
            if (defaultProj) {
                taskCard.dataset.id = defaultProj.uuid;
                setBackgroundColor(projectInput);
            }
        }

        dueDateDiv.append(dueDateInput, projectInput);

        taskForm.append(topDiv, descInput, currChecklistUl, addNewBtn, dueDateDiv);
        taskCard.appendChild(taskForm);
        tasksContainer.appendChild(taskCard);
        
        addEditTaskListener(taskCard, { setBackgroundColor });
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

    return { setBackgroundColor, renderProjectCard, renderTaskCard, createChecklistElement };
}
