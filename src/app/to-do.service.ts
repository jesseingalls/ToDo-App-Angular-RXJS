import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs/';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ToDo } from './to-dos';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  
  headers = new HttpHeaders()
    .set('content-type', 'application.json')
    .set('Access-Control-Allow-Methods', 'GET, PATCH')
    .set('X-Api-Key', 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c')
    .set('Access-Control-Allow-Origin', '*')

  baseUrl = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/';

  constructor(private http: HttpClient) { }

  // http call return observable
  public getToDos(): Observable<any> {
    return this.http.get(this.baseUrl + 'get', { 'headers': this.headers})
      .pipe(
        catchError(this.handleError())
      );
  }

  // update toDo return success message
  public updateToDo(id: number): Observable<any> {
    let jsonData = {'isComplete': true}
    console.log(id)
    return this.http.patch(this.baseUrl + 'patch/'  + id, jsonData, { 'headers': this.headers}).pipe(
      // tap(_ => this.getToDos()),
      map((res) => console.log(res)),
      catchError(this.handleError)
    )
  }

  public sortByCompleted(toDos) {
    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i]['isComplete'] === true) {
        let completedTask = toDos.splice(i, 1)
        // console.log(completedTask);
        toDos.push(completedTask[0])
      }
    }
    return toDos;
  }

  public formatDate(toDos) {
    toDos.forEach((toDo) => {
      if (toDo['dueDate'] !== null) {
        let dates = '';
        let dateString = toDo['dueDate'];
        dates += (dateString.slice(4,6) + '/');
        dates += (dateString.slice(6,9) + '/');
        dates += (dateString.slice(0,4));
        toDo['dueDate'] = dates;
      }
    })
    
    return toDos;
  }

  public sortNullDatesNotComplete(toDos) {
    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i]['dueDate'] === null && toDos[i]['isComplete'] === false) {
        let currToDo = toDos.slice(i, i + 1)
        // console.log(currToDo)
        toDos.splice(i, 1) 
        toDos.push(currToDo[0])
      }
    }
  }

  public sortWithDueDateCompletedTrue(toDos) {
    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i]['dueDate'] !== null && toDos[i]['isComplete'] === true) {
        let currToDo = toDos.slice(i, i + 1)
        // console.log(currToDo)
        toDos.splice(i, 1) 
        toDos.push(currToDo[0])
      }
    }
  }

  public sortDueDateNullCompletedTrue(toDos) {
    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i]['dueDate'] === null && toDos[i]['isComplete'] === true) {
        let currToDo = toDos.slice(i, i + 1)
        // console.log(currToDo)
        toDos.splice(i, 1) 
        toDos.push(currToDo[0])
      }
    }
  }

  public sortByDate(toDos) {
    // format date to functional number for sorting
    toDos.forEach((toDo) => {
      if (toDo['dueDate'] !== null) {
        let dueDate = toDo['dueDate'];
        dueDate = dueDate.slice(0, 10);
        dueDate = dueDate.split('-').join('');
        toDo['dueDate'] = dueDate;
      }
    })
    // sort array by due date number
    toDos.sort((a, b) => {
      return Number(a['dueDate']) - Number(b['dueDate'])
    })
    
    //TODO: refactor this code, not optimal but gets the job done

    // sort for not complete and null due date and move that item to the back
    this.sortNullDatesNotComplete(toDos)

    //sort for due date not null but completed = true, and move to back
    this.sortWithDueDateCompletedTrue(toDos)

    //sort for due date = null and complete = true
    this.sortDueDateNullCompletedTrue(toDos)
    
    // // format date for UI
    // this.formatDate(toDos);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}