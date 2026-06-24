import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { Display } from "./index.js";

const display = Display();

export function addEditTaskListener(card) {
    card.addEventListener("change", (event) => {
        const targetProjName = card.querySelector(".project-label").value;
        const targetProj = Project.findProject(targetProjName);
        if (!targetProj) return;

        const taskObj = {
            title: card.querySelector(".task-title")?.value ?? "",
            description: card.querySelector(".task-description")?.value ?? "",
            dueDate: card.querySelector(".due-date")?.value ?? "",
            priority: card.querySelector(".priority-input")?.value ?? "",
        };
        const targetUuid = card.dataset.uuid;

        if (!targetUuid) {
            const newTask = new Task(taskObj);
            targetProj.addTask(newTask);
            card.dataset.uuid = newTask.uuid;
        } else {
            const currentProjOfTask = Project.findProjectOfTask(targetUuid);
            const taskToEdit = currentProjOfTask.tasks.find(t => t.uuid === targetUuid);

            if (taskToEdit) {
                Object.assign(taskToEdit, taskObj);
                if (currentProjOfTask !== targetProj) {
                    Project.moveTask(targetUuid, currentProjOfTask, targetProj);
                }
            }
        }
        display.setCardColor(card);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditChecklistListener(card, inputElement) {
    inputElement.addEventListener("change", () => {
        const currTask = Project.findTask(card.uuid);
        const liveValue = inputElement.value.trim();
        if (!currTask || !liveValue) return;

        const parentLi = inputElement.closest("li");
        const checklistItemId = parentLi ? parentLi.dataset.id : null;

        if (!checklistItemId) {
            const newItem = currTask.addChecklistItem(liveValue);
            if (parentLi) parentLi.dataset.id = newItem.id;
        } else {
            currTask.editChecklistItem(checklistItemId, liveValue);
        }

        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addResizeInputListener(inputElement) {
    inputElement.addEventListener("input", () => {
        display.resizeInput(inputElement);
    });
}

export function addDeleteProjListener(deleteProjBtn) {
    deleteProjBtn.addEventListener("click", () => {
        Project.deleteProject(deleteProjBtn.id);
        projCard.remove();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditProjListener(card) {
    card.addEventListener("change", () => {
        const currProj = Project.getAllProjects().find((p) => p.uuid === card.id);
        const projName = card.querySelector(".proj-title").value ?? "";
        const projColor = card.querySelector(".hidden-color-picker").value ?? "";

        if (currProj) {
            if (projName !== "") currProj.name = projName;
            if (projColor !== "") currProj.color = projColor;
        } else {
            if (projName !== "") {
                const projObj = {
                    name: projName,
                    color: projColor,
                };
                const newProject = new Project(projObj);
                card.id = newProject.uuid;
            };
        };
        display.setCardColor(card);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}
