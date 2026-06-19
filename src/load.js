import { Project } from "./project.js";
import { Display } from "./index.js";
import { StorageController } from "./storage.js";

const display = Display();

function loadApplicationState() {
    StorageController.retrieveStorage();
}

export function renderProjectBtns() {
    loadApplicationState();
    const projList = Project.getAllProjects();
    for (let i = 0; i < projList.length; i++) {
        const projName = projList[i].name;
        display.createProjectBtn(projName);
    }
}