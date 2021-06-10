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
  checkedBox = document.getElementById('checkbox');

  constructor(private toDoService: ToDoService) { }

  ngOnInit() {
    this.getToDos();
    this.checkBox();
  }

  getToDos() {
    this.loading = true;
    this.toDoService.getToDos()
      .subscribe(Response => {  
        if (Response) {
          this.res = Response;
          this.toDos = this.res;
        }
        this.toDoService.sort(this.toDos);
        this.loading = false;
      })
  }

  updateToDo(toDo) {
    this.loading = true;
    if (toDo.id) {
      if (toDo['isComplete'] == false) {
        toDo['isComplete'] = true;
        this.toDoService.updateToDo(toDo.id).subscribe();
        this.toDoService.sort(this.toDos);
      }
    }
   this.loading = false;
  }

  checkBox() {
    if (this.checkedBox) {
      console.log(this.checkedBox)
    }
  }
}
