import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs/';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToDo } from './to-dos';

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

  // HTTP call to API returns observable ToDo [].
  public getToDos(): Observable<any> {
    return this.http.get<ToDo[]>(this.baseUrl + 'get', { 'headers': this.headers})
      .pipe(
        catchError(this.handleError())
      );
  }
  
  // Update toDo object and return success message.
  public updateToDo(id: number): Observable<any> {
    let jsonData = {'isComplete': true}
    return this.http.patch(this.baseUrl + 'patch/'  + id, jsonData, { 'headers': this.headers}).pipe(
      map((res) => console.log(res)),
      catchError(this.handleError)
    )
  }

  public sort(toDos: ToDo[]) {
    let today = new Date();
    toDos.forEach((toDo) => {
      // Assign a sortOrder number value based on the various conditions.
      if (toDo.dueDate !== null) {
        toDo.formattedDueDate = new Date(toDo.dueDate);
        
        // Format due date to MM/DD/YYYYY.
        let date = new Date(toDo.dueDate);
        toDo.dueDate = (1 + date.getMonth()).toString().padStart(2, '0') + '/' +date.getDate().toString().padStart(2, '0') + '/' + date.getFullYear();
      }
      else {
        // Remove null values.
        toDo.formattedDueDate = today;
      }
      if (toDo.isComplete) {
        toDo.sortOrder = 3; 
      }
      else if (toDo.formattedDueDate < today && toDo.dueDate !== null) {
        toDo.sortOrder = 1;
      }
      else {
        toDo.sortOrder = 2;
      }
    });

    // Sort the array by assigned sortOrder value and dueDate.
    toDos.sort((a, b) => {
      return a.sortOrder - b.sortOrder || a.formattedDueDate.getTime() - b.formattedDueDate.getTime();
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure.
      console.error(error); // log to console instead.
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}