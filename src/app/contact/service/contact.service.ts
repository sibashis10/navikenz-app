import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Contact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiURL = 'http://localhost:8080/contacts';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Object> {
    return this.httpClient.get(this.apiURL)
      .pipe(catchError(this.errorHandler))
  }

  create(contact: Contact): Observable<Object> {
    return this.httpClient.post(this.apiURL, JSON.stringify(contact), this.httpOptions)
      .pipe(catchError(this.errorHandler))
  }

  find(id: number): Observable<Object> {
    return this.httpClient.get(this.apiURL + '/' + id)
      .pipe(catchError(this.errorHandler))
  }

  findByName(params: any): Observable<Object> {
    return this.httpClient.get(this.apiURL + '/findByName', { params })
      .pipe(catchError(this.errorHandler))
  }

  update(contact: Contact): Observable<Object> {
    return this.httpClient.put(this.apiURL, JSON.stringify(contact), this.httpOptions)
      .pipe(catchError(this.errorHandler))
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(this.apiURL + '/' + id, this.httpOptions)
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    return throwError(errorMessage);
  }
}
