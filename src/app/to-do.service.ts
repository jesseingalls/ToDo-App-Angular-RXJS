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

  public updateToDo(id: number): Observable<any> {
    let jsonData = {'isComplete': true}
    console.log(id)
    return this.http.patch(this.baseUrl + 'patch/'  + id, jsonData, { 'headers': this.headers}).pipe(
      map((res) => console.log(res)),
      catchError(this.handleError)
    )
  }

  private moveNullDatesToBack(toDos) {
    let count = 0;
    let nullDatesArray = [];

    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i]['dueDate'] === null) {
        count++;
      } else {
        break;
      }
    }

    nullDatesArray = (toDos.slice(0, count));
    toDos.splice(0, count);
  
    nullDatesArray.forEach((toDo) => {
      toDos.push(toDo);
    })

    return toDos;
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

  private formatDate(toDos) {
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
  
    this.sortByCompleted(toDos)

    this.moveNullDatesToBack(toDos);
    this.formatDate(toDos);
    // for (let i = 0; i < toDos.length; i++) {
    //   if (toDos[i]['isComplete'] === true) {
    //     let completedTask = toDos.splice(i, 1)
    //     // console.log(completedTask);
    //     toDos.push(completedTask[0])
    //   }
    // }

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