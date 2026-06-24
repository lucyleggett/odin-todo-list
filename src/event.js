import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";

export function addEditTaskListener(inputElementsArr) {
    const taskList = Project.getAllProjects().flatMap(proj => 
        proj.tasks.map(task => ({ task, project: proj }))
    );
    inputElementsArr.forEach(input => {
        input.addEventListener("input", (event) => {
            const targetUuid = event.target.dataset.uuid;
            const match = taskList.find(({ task }) => task.uuid === targetUuid);
            if (!match) return;
            const taskKey = event.target.classList[0];
            match.task.editTask(taskKey, event.target.value);
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
        })
    })
}

export function addMoveTaskListener(projInput, parentProject) {
    projInput.addEventListener("change", (event) => {
        const newProjName = event.target.value;
        const nextProj = Project.getAllProjects().find(proj => proj.name === newProjName);
        if (nextProj){
            Project.moveTask(projInput.dataset.uuid, parentProject, nextProj);
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
        }
    });
}

export function addResizeInputListener(inputElement) {
    inputElement.addEventListener("input", () => {
        resizeInput(inputElement);
    });
}

export function addDeleteProjListener(deleteProjBtn) {
    deleteProjBtn.addEventListener("click", (event) => {
        Project.deleteProject(deleteProjBtn.id);
        projCard.remove();
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
    });
}

export function addEditProjListener(card, nameInput, colorInput) {
    card.addEventListener("change", (event) => {
        const currProj = allProjects.find((p) => p.uuid === card.id);
        if (nameInput.value !== "") currProj.name = nameInput.value;
        if (colorInput.value !== "") currProj.color = colorInput.value;
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage(Date.now(), Project.getAllProjects());
    });
}
