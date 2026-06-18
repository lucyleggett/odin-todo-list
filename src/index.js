/* Pseudocode

--Projects will hold tasks
--Each task will be an object with the following keys: title, description, dueDate, priority, checklist
--Task creation, task editing, task deletion and task assignment (to projects) will be separated
--DOM manipulation in a single module composed of factories

*/

import "./style.css";
import { printExampleProject, printExampleTask } from "./task.js";

printExampleTask();
printExampleProject();