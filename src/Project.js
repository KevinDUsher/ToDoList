import { compareAsc } from 'date-fns';
import { ToDoItem } from './toDo.js';

export class Project{

    constructor(name){
        this._name = name;
        this._toDoList = [];
    }

    addToDO(title, description, date, priority, notes, check){
        let hasToDo = false;
        console.log("In ToDo");
        for(let i = 0; i < this._toDoList.length; i++){
            if(this._toDoList[i].title == title){
                hasToDo = true;
            }
        }
        console.log("After Loop");
        if(!hasToDo){
            console.log("In If");
            let todo = new ToDoItem(title, description, date, priority, notes, check);
            let set = 0;
            for(let i = 0; i < this._toDoList.length; i++){
                console.log("Looped");
                if(compareAsc(date, this._toDoList[i].date) < 0)
                {
                    console.log("In Compare If");
                    set = 1;
                    this._toDoList.splice(i, 0, todo);
                    i = this._toDoList.length;
                    break;
                }
            }
            if(set == 0){
                this._toDoList.push(todo);
            }
            console.log("End of Method");
        }
    }

    removeItem(title){
        for(let i = 0; i < this._toDoList.length; i++){
            if(this._toDoList[i].title() == title){
                this._toDoList.splice(i,i);
            }
        }
    }

    get toDoList(){
        return this._toDoList;
    }

    get name(){
        return this._name;
    }

}