import { Task } from "./task.js";
import { Project } from "./project.js";
import { StorageController } from "./storage.js";
import { Display } from "./index.js";

const display = Display();

export function addCreateNewTaskListener(card) {
    card.addEventListener("input", () => {
        card.querySelector(".task-title");
        //Validate
        createNewTask(card)
        //Disable display for unused fields
        if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
    })
}

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
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
        })
    })
}

export function addMoveTaskListener(projInput, parentProject) {
    projInput.addEventListener("change", (event) => {
        const newProjName = event.target.value;
        const nextProj = Project.getAllProjects().find(proj => proj.name === newProjName);
        if (nextProj){
            Project.moveTask(projInput.dataset.uuid, parentProject, nextProj);
            if (StorageController.storageAvailable("localStorage")) StorageController.addToStorage("projects_list", Project.getAllProjects());
        }
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
