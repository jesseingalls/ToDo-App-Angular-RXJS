import { Component, OnInit } from '@angular/core';
import { ToDoService } from '../to-do.service';
import { ToDo } from '../to-dos';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {
  res: any;
  toDos: ToDo[] = [];
  constructor(private toDoService: ToDoService) { }

  ngOnInit() {
    this.getToDos();
  }

  getToDos() {
    this.toDoService.getToDos()
      .subscribe(Response => {
        if (Response) {
          this.res = Response;
          this.toDos = this.res;
        }
        this.toDoService.sortByDate(this.toDos);
      })
  }

  updateToDo(toDo) {
    if (toDo.id) {
      console.log('to do')
      this.toDoService.updateToDo(toDo.id).subscribe();
    }
    toDo['isComplete'] = true;
    this.toDoService.sortByCompleted(this.toDos);
  }
  
  isComplete(dueDate) {
    if (dueDate !== null) {
      return 'border: 1px black'
    }
  }
  
}
