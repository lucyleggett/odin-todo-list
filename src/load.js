import { Project } from "./project.js";
import { Display } from "./index.js";
import { StorageController } from "./storage.js";

const display = Display();

export function loadApplicationState() {
    StorageController.retrieveStorage();
}