import "./style.css";
import { StorageController } from "./storage.js";
import { Display } from "./display.js";
import { Project } from "./project.js";
import { addCalendarListener } from "./date.js";
import { addNewProjectBtnListener, addNewTaskBtnListener } from "./event.js";

function Controller() {
    const loadApplicationState = () => {
        StorageController.retrieveStorage();
    }

    const initializeProjects = () => {
        Project.getAllProjects().forEach(proj => {
                display.renderProjectCard(proj);
            });
    }

    const initializeTasks = () => {
        Project.getAllProjects().forEach(proj => {
            proj.tasks.forEach(task => {
                display.renderTaskCard(task, proj);
            });
        });
    }

    loadApplicationState();

    const display = Display();

    addNewProjectBtnListener(display);
    addNewTaskBtnListener(display);

    initializeTasks();
    initializeProjects();
    
    addCalendarListener();
}

const controller = Controller();