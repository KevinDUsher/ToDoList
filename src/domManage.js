import { Project } from './Project.js';

export class DomProjectManager{

    constructor(){
        this.projects = [];
        this.elements = [];
        this.loadProjects();
        console.log(this.projects);
        this.addBaseElement();
        this.createInputs();
        this.addProject("Main");
        this.displayAllProject();
    }

    createInputs(){
        let sidePanel;
        if (document.getElementById("projectDiv") || document.getElementById("toDoDiv")) {
            document.getElementById("sidePanel").innerHTML = "";
            sidePanel = document.getElementById("sidePanel");
        }
        else{
            sidePanel = document.createElement("div");
            sidePanel.id = "sidePanel";
        }

        let projectDiv = document.createElement("div");
        projectDiv.id = "projectDiv";
        let toDoDiv = document.createElement("div");
        toDoDiv.id = "toDoDiv";
        let projectName = document.createElement("input");
        projectName.setAttribute("type", "text");
        projectName.id = "Project";
        projectName.placeholder = "Project Name";
        let addProjectButton = document.createElement("button");
        addProjectButton.innerHTML = "Add Project"
        addProjectButton.id = "projectButton";

        let toDoProjectSelect = document.createElement("select");
        toDoProjectSelect.id = "toDoProjectSelect";
        this.projects.forEach(optionText => {
            let option = document.createElement("option");
            option.value = optionText.name;
            option.textContent = optionText.name;
            toDoProjectSelect.appendChild(option);
        });
        let toDoTitle = document.createElement("input");
        toDoTitle.setAttribute("type", "text");
        toDoTitle.id = "toDoTitle";
        toDoTitle.placeholder = "Title";
        let toDoDescription = document.createElement("input");
        toDoDescription.setAttribute("type", "text");
        toDoDescription.id = "toDoDescription";
        toDoDescription.placeholder = "Description";
        let toDoDate = document.createElement("input");
        toDoDate.setAttribute("type", "date");
        toDoDate.id = "date";
        let toDoPriority = document.createElement("select");
        let options = ["Low", "Medium", "High"];
        options.forEach(optionText => {
            let option = document.createElement("option");
            option.value = optionText.toLowerCase().replace(/\s+/g, "-"); // e.g. "option-1"
            option.textContent = optionText;
            toDoPriority.appendChild(option);
        });
        toDoPriority.id = "toDoPriority";
        let toDoNotes = document.createElement("input");
        toDoNotes.setAttribute("type", "text");
        toDoNotes.id = "toDoNotes";
        toDoNotes.placeholder = "Notes";
        let addToDoButton = document.createElement("button");
        addToDoButton.innerHTML = "Add ToDo"
        addToDoButton.id = "addToDoButton";

        addProjectButton.addEventListener("click",() => {
            this.addProject(projectName.value);
        });
        
        addToDoButton.addEventListener("click",() => {
            let name = toDoProjectSelect.value;
            let title = toDoTitle.value;
            let description =  toDoDescription.value;
            const [year, month, day] = toDoDate.value.split('-').map(Number);
            let date = [year, month, day];
            console.log(date);
            let priority = toDoPriority.value;
            let notes = toDoNotes.value;
            let check = false;
            this.addToProject(name, title, description, date, priority, notes, check)
        });

        projectDiv.appendChild(projectName);
        projectDiv.appendChild(addProjectButton);

        toDoDiv.appendChild(toDoProjectSelect);
        toDoDiv.appendChild(toDoTitle);
        toDoDiv.appendChild(toDoDescription);
        toDoDiv.appendChild(toDoDate);
        toDoDiv.appendChild(toDoPriority);
        toDoDiv.appendChild(toDoNotes);
        toDoDiv.appendChild(addToDoButton);

        sidePanel.appendChild(projectDiv);
        sidePanel.appendChild(toDoDiv);
        this.elements[0].obj.appendChild(sidePanel);
    }

    addBaseElement(){
        let element = document.createElement("div");
        element.id = "main";
        document.getElementsByTagName("body")[0].appendChild(element);
        this.elements.push({name:"main", obj: element});
    }

    addProject(name){
        let hasProject = false;
        for(let i = 0; i < this.projects.length; i++){
            if(this.projects[i].name == name){
                hasProject = true;
            }
        }
        if(!hasProject){
            let project = new Project(name);
            this.projects.push({name: name, obj: project});
            this.saveProjects();
            this.createInputs();
            this.displayAllProject();
        }
    }

    getProject(name){
        for(let i = 0; i < this.projects.length; i++){
            if(this.projects[i].name == name){
                return this.projects[i].obj;
            }
        }
    }

    saveProjects() {
        localStorage.clear();
            const plainProjects = this.projects.map(p => {
                const proj = p.obj;
                const list = Array.isArray(proj?.toDoList) ? proj.toDoList : [];

                return {
                name: p.name,
                toDoList: list.map(todo => {
                    let iso = null;

                    if (Array.isArray(todo.date)) {
                    const [y, m, d] = todo.date.map(Number);
                    if (y && m && d) {
                        const dt = new Date(y, m - 1, d);
                        if (!isNaN(dt)) iso = dt.toISOString();
                    }
                    } else if (todo.date instanceof Date) {
                    if (!isNaN(todo.date)) iso = todo.date.toISOString();
                    } else if (typeof todo.date === 'string') {
                    const dt = new Date(todo.date);
                    if (!isNaN(dt)) iso = dt.toISOString();
                    }

                    return {
                    title: todo.title,
                    description: todo.description,
                    // store ISO if valid, otherwise keep null
                    date: iso,  
                    priority: todo.priority,
                    notes: todo.notes,
                    check: !!todo.check,
                    };
                })
                };
            });

            localStorage.setItem('projects', JSON.stringify(plainProjects));
        }



    loadProjects() {
            const data = JSON.parse(localStorage.getItem('projects'));
            if (!data) return;

            this.projects = data.map(projData => {
                const project = new Project(projData.name);

                (projData.toDoList || []).forEach(todoData => {
                let arrDate = null;
                if (todoData.date) {
                    const d = new Date(todoData.date);
                    if (!isNaN(d)) {
                    arrDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                    }
                }

                project.addToDO(
                    todoData.title,
                    todoData.description,
                    arrDate,              // back as array for your other modules
                    todoData.priority,
                    todoData.notes,
                    !!todoData.check
                );
                });

                return { name: project.name, obj: project };
            });
        }



    displayAllProject(){
        let projectsEl = document.getElementById("projects");
        if(projectsEl){
            projectsEl.remove();
        }
        projectsEl = document.createElement("div");
        projectsEl.id = "projects";
        for(let i = 0; i < this.projects.length; i++){
            projectsEl.appendChild(this.displayProject(this.projects[i].name));
        }
        this.elements[0].obj.appendChild(projectsEl);
    }

    displayProject(name)
    {
        let project = this.getProject(name);
        let toDoList = project.toDoList;
        let projEl = document.createElement("div");
        projEl.classList = "project";
        let projLabel = document.createElement("div");
        projLabel.classList = "projectLabel";
        projLabel.innerHTML = name;
        projEl.appendChild(projLabel);
        for(let i = 0; i < toDoList.length; i++){
            let element = document.createElement("div");
            element.classList = "toDO";
            let title = document.createElement("div");
            title.classList = "title";
            title.textContent = toDoList[i].title;
            let description = document.createElement("div");
            description.classList = "description";
            description.textContent = toDoList[i].description;
            let date = document.createElement("div");
            date.classList = "date";
            date.textContent = toDoList[i].date;
            let priority = document.createElement("div");
            priority.classList = toDoList.priority;
            priority.textContent = toDoList[i].priority;
            let notes = document.createElement("div");
            notes.classList = "notes";
            notes.textContent = toDoList[i].notes;
            let check = document.createElement("div");
            check.classList = "check";
            check.textContent = toDoList[i].check;
            element.appendChild(title);
            element.appendChild(description);
            element.appendChild(date);
            element.appendChild(priority);
            element.appendChild(notes);
            element.appendChild(check);
            projEl.appendChild(element);
        }
        return projEl;
    }

    addToProject(name, title, description, date, priority, notes, check){
        let project = this.getProject(name);
        project.addToDO(title, description, date, priority, notes, check);
        this.saveProjects();
        this.displayAllProject();
    }

    removeClassInsides(className){
        document.getElementsByClassName(className)[0].innerHTML = "";
    }
}