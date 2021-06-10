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
  loading: boolean = false;

  constructor(private toDoService: ToDoService) { }

  ngOnInit() {
    this.getToDos();
  }

  getToDos() {
    this.loading = true;
    this.toDoService.getToDos()
      .subscribe(Response => {
        if (Response) {
          this.res = Response;
          this.toDos = this.res;
        }
        this.toDoService.sortByDate(this.toDos);
        this.toDoService.formatDate(this.toDos);
        this.loading = false;
      })
  }

  updateToDo(toDo) {
    this.loading = true;
    if (toDo.id) {
      if (toDo['isComplete'] == false) {
        console.log(toDo['isComplete'])
        toDo['isComplete'] = true;
        this.toDoService.updateToDo(toDo.id).subscribe();
        this.toDoService.sortByDate(this.toDos);
      }
      // else {
      //   toDo['isComplete'] = false;
      //   this.toDoService.updateToDo(toDo.id).subscribe();
      //   this.toDoService.sortByDate(this.toDos);
      // }
    }
   this.loading = false;
  }
}
