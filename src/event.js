import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { Display } from "./index.js";

const display = Display();

export function addNewTaskBtnListener() {
    document.querySelector("button.new-task").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderTaskCard(null, null);
    })
}

export function addNewProjectBtnListener() {
    document.querySelector("button.new-project").addEventListener("click", (event) => {
        event.preventDefault();
        display.renderProjectCard(null);
    })
}

export function addEditTaskListener(card) {
    card.addEventListener("change", (event) => {
        if (event.target.classList.contains("checklist-input") || event.target.type === "checkbox") return;

        const targetProjName = card.querySelector(".project-label").value;
        const targetProj = Project.findProject(targetProjName);
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
        display.setCardColor(card);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditChecklistListener(checklistUl) {
    checklistUl.addEventListener("change", (event) => {
        const target = event.target;
        const li = target.closest("li");
        const itemId = li?.dataset.id;
        const currTask = Project.findTask(checklistUl.dataset.uuid);

        if (!currTask || !li) return;

        const existingItem = currTask.checklist.find(item => item.id === itemId);

        //Handle checkbox toggles
        if (target.classList.contains("checklist-checkbox")) {
            if (existingItem) {
                const status = target.checked ? "completed" : "pending";
                currTask.editChecklistItem(itemId, "status", status);
            }
        }

        //Handle text inputs
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

export function addResizeInputListener(inputElement) {
    inputElement.addEventListener("input", () => {
        display.resizeInput(inputElement);
    });
}

export function addDeleteProjListener(deleteProjBtn, projCard) {
    deleteProjBtn.addEventListener("click", () => {
        Project.deleteProject(deleteProjBtn.uuid);
        projCard.remove();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}

export function addEditProjListener(card) {
    card.addEventListener("change", () => {
        const currProj = Project.getAllProjects().find((p) => p.uuid === card.dataset.id);
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
                card.dataset.id = newProject.uuid;
            };
        };
        display.setCardColor(card);
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    });
}
