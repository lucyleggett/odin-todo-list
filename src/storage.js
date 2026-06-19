import { Project } from "./project.js";

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
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }

    static addToStorage(key, value) {
        const stringified = JSON.stringify(value);
        localStorage.setItem(key, stringified);
    }

    static clear() {
        localStorage.clear();
    }
}

