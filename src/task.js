export class Task {
    constructor({ title, uuid, description, dueDate, priority, checklist, status }) {
        this.uuid = uuid || crypto.randomUUID(); 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority || "low";
        this.checklist = Array.isArray(checklist) ? checklist : [];
        this.status = status || "pending";
    }

    get details() {
        return { 
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            checklist: this.checklist,
            status: this.status,
        }
    }

    addChecklistItem(textValue) {        
        const checklistItem = {
            parentTask: this.uuid,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            text: textValue,
            status: "pending",
        }
        this.checklist.push(checklistItem);
        return checklistItem;
    }

    editChecklistItem(itemId, key, newValue) {
        const itemToEdit = this.checklist.find(item => item.id === itemId);
        if (itemToEdit) {
            itemToEdit[key] = newValue;
        };
    }

    removeChecklistItem(itemId) {
        this.checklist = this.checklist.filter(item => item.id !== itemId);        
    }

    toJSON() {
        return {
            uuid: this.uuid,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            checklist: this.checklist,
            status: this.status,
        };
    }

    static fromJSON(jsonObj) {
        if (!jsonObj) return null;
        return new Task(jsonObj);
    }
}
