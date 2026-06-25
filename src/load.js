import { Project } from "./project.js";
import { StorageController } from "./storage.js";

export function loadApplicationState() {
    StorageController.retrieveStorage();
}

export function initializeProjects(display) {
    Project.getAllProjects().forEach(proj => {
            display.renderProjectCard(proj);
        });
}

export function initializeTasks(display) {
    Project.getAllProjects().forEach(proj => {
        proj.tasks.forEach(task => {
            display.renderTaskCard(task, proj);
        });
    });
}