import "./style.css";
import { StorageController } from "./storage.js";
import { Display } from "./display.js";
import { Task } from "./task.js";
import { Project } from "./project.js";
import { filter } from "./filter.js";
import { addCalendarListener } from "./date.js";
import { addNewBtnListener, addOpenCloseTaskCardListener, addTextAreaGrowListener, addTitleSwipeListener, onDOMLoadListener } from "./event.js";
import { Animate } from "./animate.js";

function Controller() {
    const display = Display();
    
    const loadApplicationState = () => {
        const hasData = StorageController.retrieveStorage();
        if (!hasData) loadDummyData();
    }

    const loadDummyData = () => {
        const defaultProject = new Project({
            name: "Example Project",
            color: "#7E5CBC",
        })

        const dummyTask = new Task({
            title: "Create your first task!",
            description: "Swipe right to create your first project 😊",
            checklist: [
                {text: "Hit the ➕ button to add a new task"},
                {text: "Click the green dot to set its priority 🚦"},
                {text: "Add a deadline 🗓️"},
                {text: "Assign the task to your new project 🗄️"},
                {text: "Filter tasks by project, priority or status 🧐"}
            ],
            dueDate: new Date().toISOString().split('T')[0],
        })

        defaultProject.addTask(dummyTask);
        StorageController.saveIfStorageAvailable();
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

    addNewBtnListener(display);
    initializeTasks();
    initializeProjects();

    addCalendarListener();
    addTitleSwipeListener();

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

    const animate = Animate();
}

const controller = Controller();