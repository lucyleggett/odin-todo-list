import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";

export function addTextAreaGrowListener() {
    const textareas = document.querySelectorAll("textarea");

    textareas.forEach(textarea => {
        textarea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
            });
    });
}

export function addNewTaskBtnListener(display) {
    document.querySelector("button.new-task").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderTaskCard(null, null);
    })
}

export function addNewProjectBtnListener(display) {
    document.querySelector("button.new-project").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderProjectCard(null);
    })
}

export function addEditTaskListener(card, { setBackgroundColor }) {
    card.addEventListener("change", (event) => {
        if (event.target.classList.contains("checklist-input") || event.target.type === "checkbox") return;
        if (event.target.classList.contains("priority-btn")) return;
        if (event.target.classList.contains("task-status-btn")) return;

        const targetProjName = card.querySelector(".project-label").value;
        const targetProj = Project.findProjectByName(targetProjName);
        if (!targetProj) return;
        card.dataset.id = targetProj.uuid;

        const targetUuid = card.dataset.uuid;
        let taskToEdit = targetUuid ? Project.findTask(targetUuid) : null;

        const taskObj = {
            title: card.querySelector(".task-title")?.value ?? "",
            description: card.querySelector(".task-description")?.value ?? "",
            dueDate: card.querySelector(".custom-date")?.value ?? "",
        };

        if (!targetUuid) {
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
        const projectInput = card.querySelector(".project-input");
        setBackgroundColor(projectInput);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditStatusListener(taskStatusBtn) {
    taskStatusBtn.addEventListener("click", () => {
        const currTask = Project.findTask(taskStatusBtn.dataset.id);
        const pendingIcon = taskStatusBtn.querySelector(".pending", ".status-icon");
        const completeIcon = taskStatusBtn.querySelector(".complete", ".status-icon");

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
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
        }
    })
}

export function addEditPriorityListener(priorityBtn, priorityColourMap) {
    priorityBtn.addEventListener("click", () => {
        const currTask = Project.findTask(priorityBtn.dataset.id);
        if (currTask) {
            const currOptionIndex = priorityColourMap.findIndex(option => option.priority === currTask.priority);
            if (currOptionIndex !== -1) {
                const newOptionIndex = (currOptionIndex + 1) % priorityColourMap.length;
                currTask.priority = priorityColourMap[newOptionIndex].priority;
                priorityBtn.style.color = priorityColourMap[newOptionIndex].color;
            }
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
        }
    })
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
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
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
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
        }
    });
}

export function addDeleteProjListener(deleteProjBtn, projCard) {
    deleteProjBtn.addEventListener("click", (event) => {
        event.preventDefault();
        Project.deleteProject(deleteProjBtn.dataset.uuid);
        projCard.remove();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditProjListener(card, {setBackgroundColor}) {
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
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}
