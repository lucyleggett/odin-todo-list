import { Task } from "./task.js";
import { Project } from "./project.js";
import brushIcon from "./images/brush-tool-svgrepo-com.svg";
import checkboxIcon from "./images/checkbox-svgrepo-com.svg";
import checkedIcon from "./images/checked-checkbox-svgrepo-com.svg"
import binIcon from "./images/trash-svgrepo-com.svg"
import priorityIconRaw from "./images/circle-svgrepo-com (1).svg?raw";
import { addOpenCloseTaskCardListener, addDeleteProjListener, addEditTaskListener, addEditProjListener, addListener, addEditChecklistListener, addDeleteChecklistItemListener, addNewBtnListener, addEditPriorityListener, addEditStatusListener, addTextAreaGrowListener, addDeleteTaskListener, addFilterMenuListeners } from "./event.js";
import { updateDateDisplay } from "./date.js";
import { filterTasks } from "./filter.js";

export function Display() {

    const setBackgroundColor = (element) => {
        if (!element) return;
        let currProj = Project.findProjectOfTask(element.dataset.id);

        if (!currProj && element.tagName === "SELECT") {
            currProj = Project.findProjectByName(element.value);
        }
        
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

    const renderFilterMenuOptions = () => {
        const projectSubcat = document.querySelector(".project.filter-subcat");
        projectSubcat.innerHTML = ""; 
        const projectH5 = document.createElement("h5");
        projectH5.textContent = "Project";
        projectSubcat.appendChild(projectH5);

        Project.getAllProjects().forEach(proj => {
            const filterDiv = document.createElement("div");
            filterDiv.classList.add("filter");
            const filterLabel = document.createElement("label");
            const filterCheckbox = document.createElement("input");
            filterCheckbox.type = "checkbox";
            filterCheckbox.name = "project";
            filterCheckbox.value = proj.name;
            const labelText = proj.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
            
            filterLabel.appendChild(filterCheckbox);
            filterLabel.appendChild(document.createTextNode(labelText));
            filterDiv.appendChild(filterLabel);
            projectSubcat.appendChild(filterDiv);
        })
    }

    const renderProjectCard = (projectData = null) => {
        const projContainer = document.querySelector(".projects.view-panel");
        const projCard = document.createElement("div");
        projCard.classList.add("project-card", "slide-in");

        if (projectData) projCard.dataset.id = projectData.uuid;

        const projForm = document.createElement("form");
        projForm.classList = "new-project-form";
        projForm.addEventListener("submit", (e) => e.preventDefault());

        const inputWrap = document.createElement("div");
        inputWrap.classList.add("input-wrap");

        const projTitleMirror = document.createElement("span")
        projTitleMirror.classList.add("proj-title-mirror");

        const projTitle = document.createElement("input");
        projTitle.type = "text";
        projTitle.maxLength = 16;
        projTitle.placeholder = "Title";
        projTitle.size = 1;
        projTitle.classList.add("proj-title");
        projTitle.focus();

        if (projectData) projTitle.value = projectData.name;
        projTitleMirror.textContent = projTitle.value || projTitle.placeholder;

        projTitle.addEventListener("input", () => {
            projTitleMirror.textContent = projTitle.value || projTitle.placeholder;
        })

        const projectIdentifier = projectData ? projectData.uuid : Math.random().toString(36).substr(2, 9);
        const uniqueID = `color-picker-${projectIdentifier}`;

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon-container");

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.id = uniqueID;
        colorPicker.name = "color";
        colorPicker.classList.add("hidden-color-picker");
        colorPicker.setAttribute("list", "presetColors" + uniqueID);

        const colorPickerIcon = document.createElement("img");
        colorPickerIcon.src = brushIcon;
        colorPickerIcon.classList.add("brush", "icon");

        const colorPickerLabel = document.createElement("label");
        colorPickerLabel.setAttribute("for", uniqueID);
        colorPickerLabel.classList.add("color-picker-label");
        colorPickerLabel.append(colorPickerIcon, colorPicker);

        const colorPalette = [
            "#3E8235", 
            "#7E5CBC", 
            "#C6246E", 
            "#1C2C82", 
            "#CE350E"
        ];

        const datalist = document.createElement("datalist");
        datalist.id = "presetColors" + `${uniqueID}`;
        colorPalette.forEach((color) => {
            const option = document.createElement("option");
            option.value = color;
            datalist.appendChild(option);
        })

        projectData ? colorPicker.value = projectData.color : colorPicker.value = colorPalette[0];

        const deleteProjBtn = document.createElement("button");
        deleteProjBtn.classList.add("delete-btn");
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete", "icon");
        deleteIcon.src = binIcon;

        if (projectData) deleteProjBtn.dataset.uuid = projectData.uuid;
        
        deleteProjBtn.appendChild(deleteIcon);
        addDeleteProjListener(deleteProjBtn, projCard, {renderFilterMenuOptions} );

        inputWrap.append(projTitleMirror, projTitle);
        iconDiv.append(colorPickerLabel, datalist, deleteProjBtn);
        projForm.append(inputWrap, iconDiv);
        projCard.appendChild(projForm);
        setBackgroundColor(projCard);
        addEditProjListener(projCard, { setBackgroundColor, renderFilterMenuOptions });
        projContainer.prepend(projCard);
        renderFilterMenuOptions();
        addFilterMenuListeners( {renderTaskCard} );
    }

    const renderTaskCard = (taskData = null, parentProject = null) => {
        const tasksContainer = document.querySelector(".tasks.view-panel");
        const taskCard = document.createElement("div");
        taskCard.style.setProperty("--card-delay", "0ms");
        taskCard.classList.add("task-card", "slide-in");
        
        const isDummyCard = taskData && taskData.title === "Create your first task!";
        if (isDummyCard) taskCard.classList.add("expanded");

        let resolvedTaskData = taskData;

        if (!resolvedTaskData) {
            setTimeout(() => titleInput.focus(), 0);
            taskCard.classList.add("new-card");
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    taskCard.classList.add("expanded");
                });
            });

            taskCard.addEventListener("animationend", () => {
                taskCard.classList.remove("new-card");
            }, { once: true });

            resolvedTaskData = resolvedTaskData = new Task({ title: "", description: "", dueDate: "", priority: "low", checklist: [] });
            parentProject = Project.getAllProjects()[0];
        }

        taskCard.dataset.uuid = resolvedTaskData.uuid;

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
        titleInput.maxLength = 50;
        titleInput.rows = 1;
        titleInput.placeholder = "Title";
        titleInput.required = true;
        titleInput.dataset.id = taskCard.dataset.uuid;
        titleInput.value = resolvedTaskData.title;

        const priorityColourMap = [
            { priority: "low", color: "#008002" },
            { priority: "medium", color: "#ff7300"},
            { priority: "high", color: "#ab0808" }
        ]

        const matchedPriority = priorityColourMap.find(item => item.priority === resolvedTaskData.priority);
        if (matchedPriority) priorityBtn.style.color = matchedPriority.color;

        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.classList.add("delete-task-btn");
        deleteTaskBtn.type = "button";
        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete", "icon");
        deleteIcon.src = binIcon;
        deleteTaskBtn.appendChild(deleteIcon);
        addDeleteTaskListener(deleteTaskBtn, taskCard);

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

        if (resolvedTaskData.status === "pending") {
                taskStatusComplete.classList.add("disabled");
        } else {
            taskStatusPending.classList.add("disabled");
        }

        taskStatusBtn.append(taskStatusPending, taskStatusComplete);
        addEditStatusListener(taskStatusBtn);

        topDiv.append(priorityBtn, titleInput, deleteTaskBtn, taskStatusBtn);

        const descInput = document.createElement("textarea");
        descInput.classList.add("task-description");
        descInput.name = "taskDesc";
        descInput.maxLength = 200;
        descInput.rows = 1;
        descInput.placeholder = "Description";
        descInput.dataset.id = taskCard.dataset.uuid;
        descInput.value = resolvedTaskData.description;

        const currChecklistUl = document.createElement("ul");
        currChecklistUl.dataset.id = taskCard.dataset.uuid;
        currChecklistUl.classList.add("checklist");

        if (resolvedTaskData.checklist.length > 0) {
            resolvedTaskData.checklist.forEach(item => {
                createChecklistElement(currChecklistUl, item)
            });
        } else {
            createChecklistElement(currChecklistUl, {});
        }
            
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList.add("due-date");

        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.classList.add("custom-date");
        dueDateInput.name = "taskDueDate";
        dueDateInput.dataset.id = taskCard.dataset.uuid;
        dueDateInput.value = resolvedTaskData.dueDate;
        dueDateDiv.appendChild(dueDateInput);

        updateDateDisplay(dueDateInput);
        dueDateInput.addEventListener("change", () => {
            updateDateDisplay(dueDateInput);
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

        projectInput.value = parentProject.name;
        taskCard.dataset.id = parentProject.uuid;
        setBackgroundColor(projectInput);

        const lowerDiv = document.createElement("div");
        lowerDiv.classList.add("lower");
        lowerDiv.append(dueDateDiv, projectInput);

        const innerExpandWrapper = document.createElement("div");
        innerExpandWrapper.classList.add("inner-expand-wrapper");
        innerExpandWrapper.append(descInput, currChecklistUl);

        const collapsibleContent = document.createElement("div");
        collapsibleContent.classList.add("collapsible-content");
        collapsibleContent.append(innerExpandWrapper);

        taskForm.append(topDiv, collapsibleContent, lowerDiv);
        taskCard.appendChild(taskForm);
        tasksContainer.prepend(taskCard);
        
        addEditPriorityListener(priorityBtn, priorityColourMap);
        addEditTaskListener(taskCard, { setBackgroundColor });
        if (!isDummyCard) addOpenCloseTaskCardListener(taskCard);
    }

    const createChecklistElement = (checklistUl, currChecklistData) => {
        const li = document.createElement("li");
        if (currChecklistData.id) li.dataset.id = currChecklistData.id;

        const label = document.createElement("label");
        label.classList.add("checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checklist-checkbox");

        const checklistInput = document.createElement("textarea");
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

        checklistInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                if (checklistInput.value.trim() !== "") {
                    createChecklistElement(checklistUl, {});

                    setTimeout(() => {
                        const inputs = checklistUl.querySelectorAll(".checklist-input");
                        const lastInput = inputs[inputs.length - 1];
                        if (lastInput) lastInput.focus();
                    }, 0);
                }
            }
        });
 
        label.append(checkbox, checklistInput);
        li.append(label, deleteItemBtn);
        checklistUl.appendChild(li);

        addEditChecklistListener(checklistUl);
        addDeleteChecklistItemListener(checklistUl);
    }

    return { setBackgroundColor, renderFilterMenuOptions, renderProjectCard, renderTaskCard, createChecklistElement };
}
