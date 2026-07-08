export class Project {
  #name;
  #tasks;
  #color;
  static instances = [];

  constructor({ uuid, name, color }) {
    this.uuid = uuid || crypto.randomUUID();
    const finalName = name || "";
    this.#name = Project.toTrueTitleCase(finalName);
    this.#color = color;
    this.#tasks = [];

    Project.instances.push(this);
  }

  static getAllProjects() {
    return Project.instances;
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    this.#name = Project.toTrueTitleCase(newName || "");
  }

  get color() {
    return this.#color;
  }

  set color(newColor) {
    this.#color = newColor;
  }

  get tasks() {
    return this.#tasks;
  }

  static deleteProject(projectUuid) {
    const index = Project.instances.findIndex((p) => p.uuid === projectUuid);
    if (index !== -1) {
      Project.instances.splice(index, 1);
    }
  }

  static findProject(projectUuid) {
    return Project.getAllProjects().find((proj) => proj.uuid === projectUuid);
  }

  static findProjectByName(projectName) {
    if (!projectName) return null;
    return Project.getAllProjects().find(
      (proj) => proj.name === Project.toTrueTitleCase(projectName),
    );
  }

  static findProjectOfTask(taskId) {
    return Project.getAllProjects().find((proj) =>
      proj.tasks.some((task) => task.uuid === taskId),
    );
  }

  static findTask(taskUuid) {
    for (const proj of Project.getAllProjects()) {
      const foundTask = proj.tasks.find((task) => task.uuid === taskUuid);
      if (foundTask) return foundTask;
    }
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  removeTask(taskUuid) {
    this.#tasks = this.#tasks.filter((t) => t.uuid !== taskUuid);
  }

  toJSON() {
    return {
      uuid: this.uuid,
      name: this.#name,
      color: this.#color,
      tasks: this.tasks,
    };
  }

  static moveTask(taskUUID, currProj, nextProj) {
    const targetTask = currProj.tasks.find((t) => t.uuid === taskUUID);
    currProj.removeTask(taskUUID);
    nextProj.addTask(targetTask);
  }

  static toTrueTitleCase(str) {
    const exceptions = [
      "a",
      "an",
      "the",
      "and",
      "but",
      "or",
      "for",
      "nor",
      "on",
      "in",
      "at",
      "to",
      "by",
      "of",
    ];

    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (index > 0 && exceptions.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
}
