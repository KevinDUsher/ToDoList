import { compareAsc, format } from "date-fns";

export class ToDoItem{

    constructor(title, description, date, priority, notes, check){
        this._title = title;
        this._description = description;
        this._priority = priority;
        this._date = new Date(date[0],date[1],[2]);
        this._notes = notes;
        this._check = check;
    }

    get title(){
        return this._title;
    }
    
    get description(){
        return this._description;
    }

    get date(){
        return this._date;
    }

    get priority(){
        return this._priority;
    }

    get notes(){
        return this._notes;
    }

    get check(){
        return this._check;
    }
 
    set title(value){
        this._title = value;
    }
    
    set description(value){
        this._description = value;
    }

    set date(value){
        this._date = value;
    }

    set priority(value){
        this._priority = value;
    }

    set notes(value){
        this._notes = value;
    }

    set check(value){
        this._check = value;
    }
}