import { Project } from "./project.js";
import { Task } from "./task.js";

export class StorageController {

    static storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            storage &&
            storage.length !== 0
            );
        }
    }

    static addToStorage(key, value) {
        const stringified = JSON.stringify(value);
        localStorage.setItem(key, stringified);
    }

    static retrieveStorage() {
        const rawData = localStorage.getItem("projects_list");
        if (!rawData || rawData === "[]") return false;

        const parsedProjects = JSON.parse(rawData);
        Project.instances = [];

        parsedProjects.forEach(projData => {
            const reconstructedProject = new Project({
                uuid: projData.uuid, 
                name: projData.name, 
                color: projData.color
            });
            projData.tasks.forEach(taskData => {
                const reconstructedTask = Task.fromJSON(taskData);
                if (reconstructedTask) reconstructedProject.addTask(reconstructedTask);
            });
        });

        return true;
    }

    static clear() {
        localStorage.clear();
    }

    static saveIfStorageAvailable() {
        if (StorageController.storageAvailable("localStorage")) {
            StorageController.addToStorage("projects_list", Project.getAllProjects());
        }
    }
}

