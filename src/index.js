import "./style.css";
import { StorageController } from "./storage.js";
import { Display } from "./display.js";
import { Project } from "./project.js";
import { filter } from "./filter.js";
import { addCalendarListener } from "./date.js";
import { addNewBtnListener, addOpenCloseTaskCardListener, addTextAreaGrowListener, addTitleSwipeListener } from "./event.js";

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

    addTitleSwipeListener();
    addNewBtnListener(display);

    initializeTasks();
    initializeProjects();

    addCalendarListener();
}

const controller = Controller();