import { StorageController } from "./storage.js";

export function loadApplicationState() {
    StorageController.retrieveStorage();
}