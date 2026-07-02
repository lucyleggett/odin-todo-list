import "./style.css";
import { StorageController } from "./storage.js";
import { Display } from "./display.js";
import { Project } from "./project.js";
import { filter } from "./filter.js";
import { addCalendarListener } from "./date.js";
import { addNewBtnListener, addOpenCloseTaskCardListener, addTextAreaGrowListener, addTitleSwipeListener, onDOMLoadListener } from "./event.js";
import { Animate } from "./animate.js";

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

    document.addEventListener("DOMContentLoaded", () => {
        const filterMenu = document.querySelector(".filter-menu");

        if (filterMenu) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    filterMenu.classList.remove("no-transition");
                })
            });
        }
    })

    const display = Display();

    addNewBtnListener(display);

    initializeTasks();
    initializeProjects();

    addCalendarListener();
    addTitleSwipeListener();

    const animate = Animate();
}

const controller = Controller();