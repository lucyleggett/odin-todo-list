import { Project } from "./project.js";
import { Display } from "./index.js";
import { StorageController } from "./storage.js";

const display = Display();

export function loadApplicationState() {
    StorageController.retrieveStorage();
}

export function initializeProjects() {
    Project.getAllProjects().forEach(proj => {
            display.renderProjectCard(proj);
        });
}

export function initializeTasks() {
    Project.getAllProjects().forEach(proj => {
        proj.tasks.forEach(task => {
            display.renderTaskCard(task, proj);
        });
    });
}