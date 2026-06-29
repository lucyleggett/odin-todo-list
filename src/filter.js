import { Project } from "./project.js";

export function filterTasks( {renderTaskCard} ) {
    document.querySelector(".tasks-container").replaceChildren();

    const filterOptions = document.querySelectorAll(".filter-menu input[type=checkbox]");

    const checkedBoxes = [...filterOptions].filter(f => f.checked);
    const filtersApplied = Object.groupBy(checkedBoxes, f => f.name);

    for (const key in filtersApplied) {
        filtersApplied[key] = filtersApplied[key].map(input => input.value);
    }
    
    const allTasks = Project.getAllProjects().flatMap(proj => proj.tasks);
    
    const filteredTasks = allTasks.filter(task =>
        Object.entries(filtersApplied).every(([key, allowedValues]) => {
            return allowedValues.includes(task[key]);
        })
    );
    
    filteredTasks.forEach(task => {
        const matchParent = Project.findProjectOfTask(task.uuid);
        renderTaskCard(task, matchParent);
    })
}