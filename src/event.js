import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { filterTasks } from "./filter.js";

export function addTitleSwipeListener() {
    document.addEventListener("DOMContentLoaded", () => {
        const viewTitle = document.getElementById("dynamic-view-title");
        const swipeViewport = document.getElementById("view-swipe-viewport");
        const viewPanels = document.querySelectorAll(".view-panel");
        const newBtn = document.querySelector(".new-btn");
        const filterBtn = document.querySelector("button.filter");
        const filterMenu = document.querySelector(".filter-menu");

        const viewObserverOptions = {
            root: swipeViewport,
            threshold: 0.5
        };

        const viewObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeTitleName = entry.target.getAttribute("data-title");

                    if (activeTitleName === "Tasks") {
                        newBtn.dataset.id = "new-task";
                    } else if (activeTitleName === "Projects") {
                        newBtn.dataset.id = "new-project";
                    }

                    if (viewTitle.textContent !== activeTitleName) {
                        const directionClass = activeTitleName === "Tasks" ? "slide-left" : "slide-right";
                        viewTitle.classList.add("changing", directionClass);
                        filterBtn.classList.add("changing");
                        setTimeout(() => {
                            viewTitle.textContent = activeTitleName;

                            if (activeTitleName === "Tasks") {
                                filterBtn.classList.remove("hidden");
                            } else if (activeTitleName === "Projects") {
                                filterBtn.classList.add("hidden");
                                if (filterMenu) {
                                    filterMenu.classList.add("hidden");
                                }
                            }
                            viewTitle.classList.remove("changing", "slide-left", "slide-right");
                            filterBtn.classList.remove("changing");
                        }, 250);
                    }
                }
            });
        };
        const viewObserver = new IntersectionObserver(viewObserverCallback, viewObserverOptions);
        viewPanels.forEach(panel => viewObserver.observe(panel));
    });
}

export function addFilterMenuListeners( {renderTaskCard} ) {
    const filterMenu = document.querySelector(".filter-menu");
    const filterBtn = document.querySelector("button.filter");
    if (!filterMenu || !filterBtn) return;

    const closeOnOutsideClick = (e) => {
        if ((!filterMenu.contains(e.target)) && !filterBtn.contains(e.target)) {
            filterMenu.classList.add("hidden");
            document.removeEventListener("click", closeOnOutsideClick);
        }
    };

    filterBtn.addEventListener("click", () => {
        const isHidden = filterMenu.classList.toggle("hidden");

        if (!isHidden){
            document.addEventListener("click", closeOnOutsideClick);
        } else {
            document.removeEventListener("click", closeOnOutsideClick);
        }
    });

    filterMenu.querySelector(".apply-filter-btn").addEventListener("click", () => {
        filterTasks( {renderTaskCard} );
        filterMenu.classList.add("hidden");
    });
}

export function addOpenCloseTaskCardListener(card) {
    const closeOnOutsideClick = (e) => {
        if (!card.contains(e.target)) {
            card.classList.remove("expanded");
            document.removeEventListener("click", closeOnOutsideClick);
        }
    };

    const attachCloseListener = () => {
        setTimeout(() => {
            document.addEventListener("click", closeOnOutsideClick);
        }, 0);
    };

    if (card.classList.contains("expanded")) {
        attachCloseListener();
    }

    const observer = new MutationObserver(() => {
        if (card.classList.contains("expanded")) {
            attachCloseListener();
            observer.disconnect();
        }
    });

    observer.observe(card, { attributeFilter: ["class"] });

    card.addEventListener("click", () => {
        if (card.classList.contains("expanded")) return;
        card.classList.add("expanded");
        attachCloseListener();
    });
}

export function addNewBtnListener(display) {
    const newBtn = document.querySelector(".new-btn");
    newBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (newBtn.dataset.id === "new-task") display.renderTaskCard(null, null);
        if (newBtn.dataset.id === "new-project") display.renderProjectCard(null);
    })
}

export function addEditTaskListener(card, { setBackgroundColor }) {
    card.addEventListener("change", (event) => {
        if (event.target.classList.contains("checklist-input") || event.target.type === "checkbox") return;
        if (event.target.classList.contains("priority-btn")) return;
        if (event.target.classList.contains("task-status-btn")) return;

        const projInput = card.querySelector(".project-label");
        const targetProj = Project.findProjectByName(projInput.value);
        card.dataset.id = targetProj.uuid;

        const targetUuid = card.dataset.uuid;
        let taskToEdit = targetUuid ? Project.findTask(targetUuid) : null;

        const taskObj = {
            title: card.querySelector(".task-title")?.value.trim() ?? "",
            description: card.querySelector(".task-description")?.value.trim() ?? "",
            dueDate: card.querySelector(".custom-date")?.value ?? "",
        };

        if (!taskToEdit) {
            const newTask = new Task(taskObj);
            targetProj.addTask(newTask);
            card.dataset.uuid = newTask.uuid;
        } else if (taskToEdit) {
            const currentProjOfTask = Project.findProjectOfTask(targetUuid);
            Object.assign(taskToEdit, taskObj);

            if (currentProjOfTask !== targetProj) {
                Project.moveTask(targetUuid, currentProjOfTask, targetProj);
            }
        }
        const projectInput = card.querySelector(".project-label");
        setBackgroundColor(projectInput);
        StorageController.saveIfStorageAvailable();
    });
}

export function addEditStatusListener(taskStatusBtn) {
    taskStatusBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const currTask = Project.findTask(taskStatusBtn.dataset.id);
        const pendingIcon = taskStatusBtn.querySelector(".pending.status-icon");
        const completeIcon = taskStatusBtn.querySelector(".complete.status-icon");

        if (currTask) {
            if (currTask.status === "pending") {
                currTask.status = "complete";
                pendingIcon.classList.add("disabled");
                completeIcon.classList.remove("disabled");
            } else if (currTask.status === "complete") {
                currTask.status = "pending";
                pendingIcon.classList.remove("disabled");
                completeIcon.classList.add("disabled");
            }
            StorageController.saveIfStorageAvailable();
        }
    })
}

export function addEditPriorityListener(priorityBtn, priorityColourMap) {
    if (!priorityBtn) return;

    priorityBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const taskCard = priorityBtn.closest(".task-card");
        const taskUuid = taskCard.dataset.uuid;
        const currTask = Project.findTask(taskUuid);
        
        if (currTask) {
            const currOptionIndex = priorityColourMap.findIndex(option => option.priority === currTask.priority);
            if (currOptionIndex !== -1) {
                const newOptionIndex = (currOptionIndex + 1) % priorityColourMap.length;
                currTask.priority = priorityColourMap[newOptionIndex].priority;
                priorityBtn.style.color = priorityColourMap[newOptionIndex].color;
            }
            StorageController.saveIfStorageAvailable();
        }
    })
}

export function addDeleteTaskListener(deleteTaskBtn, taskCard) {
    deleteTaskBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        const parentProj = Project.findProjectOfTask(taskCard.dataset.uuid);
        if (parentProj) {
            parentProj.removeTask(taskCard.dataset.uuid);
            taskCard.remove();
            StorageController.saveIfStorageAvailable();
        } else {
            taskCard.remove();
        }
    });
}

export function addEditChecklistListener(checklistUl) {
    checklistUl.addEventListener("change", (event) => {
        const target = event.target;
        const li = target.closest("li");
        const input = li.querySelector(".checklist-input");
        const itemId = li?.dataset.id;
        const currTask = Project.findTask(checklistUl.dataset.id);

        if (!currTask || !li) return;

        const existingItem = currTask.checklist.find(item => item.id === itemId);

        if (target.classList.contains("checklist-checkbox")) {
            if (existingItem) {
                const status = target.checked ? "completed" : "pending";
                currTask.editChecklistItem(itemId, "status", status);
                if (target.checked) {
                    input.classList.add("checked");
                } else {
                    input.classList.remove("checked");
                }
            }
        }

        if (target.classList.contains("checklist-input")) {
            if (existingItem) {
                currTask.editChecklistItem(itemId, "text", target.value);
            } else if (target.value.trim()) {
                const newItem = currTask.addChecklistItem(target.value);
                li.dataset.id = newItem.id;
            }
        }
        StorageController.saveIfStorageAvailable();
    });
}

export function addDeleteChecklistItemListener(checklistUl) {
    checklistUl.addEventListener("click", (event) => {
        const target = event.target;
        if (!target.classList.contains("checklist-delete")) return;

        const li = target.closest("li");
        const itemId = li?.dataset.id;
        const currTask = Project.findTask(checklistUl.dataset.uuid);

        if (currTask && itemId) {
            currTask.removeChecklistItem(itemId);
            li.remove();
            StorageController.saveIfStorageAvailable();
        }
    });
}

export function addDeleteProjListener(deleteProjBtn, projCard, {renderFilterMenuOptions}) {
    deleteProjBtn.addEventListener("click", (event) => {
        event.preventDefault();
        Project.deleteProject(deleteProjBtn.dataset.uuid);
        projCard.remove();
        renderFilterMenuOptions();
        StorageController.saveIfStorageAvailable();
    });
}

export function addEditProjListener(card, {setBackgroundColor, renderFilterMenuOptions}) {
    card.addEventListener("change", (event) => {
        event.preventDefault();
        setBackgroundColor(card);
        const target = event.target;
        let currProj = Project.findProject(card.dataset.id);

        const projName = card.querySelector(".proj-title").value.trim() ?? "";
        const projColor = card.querySelector(".hidden-color-picker").value ?? "";

        if (!currProj) {
            if (projName === "") return;
            const newProject = new Project({name: projName, color: projColor});
            card.dataset.id = newProject.uuid;

            const deleteItemBtn = card.querySelector(".delete-btn");
            if (deleteItemBtn) deleteItemBtn.dataset.uuid = newProject.uuid;

            currProj = newProject;
        } else {
            if (target.classList.contains("proj-title")) {
                currProj.name = projName;
            };
            if (target.classList.contains("hidden-color-picker")) {
                currProj.color = projColor
            }
        }
        StorageController.saveIfStorageAvailable();
        renderFilterMenuOptions();

        const projectInputs = document.querySelectorAll(".project-label");
        let projectOptions = [];
        Project.getAllProjects().forEach(proj => {
            const option = proj.name;
            projectOptions.push(option);
        });

        projectInputs.forEach(input => {
            input.replaceChildren();
            projectOptions.forEach (o => {
                const option = document.createElement("option");
                option.value = o;
                option.textContent = o;
                input.appendChild(option);
            })
        });                
    });
}
