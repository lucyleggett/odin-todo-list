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
        const keys = Object.keys(localStorage);
        if (keys.length === 0) return;

        const latestSaveKey = keys.reduce((max, current) => Math.max(max, current), -Infinity);
        if (latestSaveKey === -Infinity) return;

        const rawData = localStorage.getItem(latestSaveKey.toString());
        if (!rawData) return;

        const parsedProjects = JSON.parse(rawData);

        parsedProjects.forEach(projData => {
            const reconstructedProject = new Project(projData.uuid, projData.name, projData.color);
            projData.tasks.forEach(taskData => {
                const reconstructedTask = Task.fromJSON(taskData);
                reconstructedProject.addTask(reconstructedTask);
            });
        });
    }

    static clear() {
        localStorage.clear();
    }
}

