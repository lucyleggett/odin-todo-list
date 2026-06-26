import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";

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

export function addEditTaskListener(card, {setCardColor}) {
    card.addEventListener("change", (event) => {
        if (event.target.classList.contains("checklist-input") || event.target.type === "checkbox") return;

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
            priority: card.querySelector(".priority-input")?.value ?? "",
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
        setCardColor(card);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditChecklistListener(checklistUl) {
    checklistUl.addEventListener("change", (event) => {
        const target = event.target;
        const li = target.closest("li");
        const input = li.querySelector(".checklist-input");
        const itemId = li?.dataset.id;
        const currTask = Project.findTask(checklistUl.dataset.uuid);

        if (!currTask || !li) return;

        const existingItem = currTask.checklist.find(item => item.id === itemId);

        if (target.classList.contains("checklist-checkbox")) {
            if (existingItem) {
                const status = target.checked ? "completed" : "pending";
                currTask.editChecklistItem(itemId, "status", status);
                if (target.checked) {
                    input.classList.add("checked");
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

export function addEditProjListener(card, {setCardColor}) {
    card.addEventListener("change", (event) => {
        event.preventDefault();
        setCardColor(card);
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
