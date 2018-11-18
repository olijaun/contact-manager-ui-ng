import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Person} from './person';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {ValidationErrorHandler} from "./validation.error.handler";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class PersonService {

  constructor(private http: HttpClient, private oauthService: OAuthService,
              private messageService: MessageService) {

  }

  private personsUrl = '/api/persons';

  addPerson(contact: Person, validationErrorHandler: ValidationErrorHandler): Observable<Person> {
    return this.http.post<Person>(this.personsUrl, contact, httpOptions).pipe(
      catchError(this.handleError<Person>('person', validationErrorHandler))
    );
  }

  getPersons(): Observable<Person[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.addTechnicalError('HeroService: fetched heroes');
    return this.http.get<Person[]>(this.personsUrl).pipe(
      catchError(this.handleError('getHeroes', null))
    );
  }

  getPerson(id: string, validationErrorHandler): Observable<Person> {
    const url = `${this.personsUrl}/${id}`;
    return this.http.get<Person>(url, this.getOptions()).pipe(
      catchError(this.handleError<Person>(`getContact id=${id}`, validationErrorHandler))
    );
  }

  updatePerson(person: Person, validationErrorHandler: ValidationErrorHandler): Observable<any> {
    return this.http.put(this.personsUrl + '/' + person.id, person, this.getOptions()).pipe(
      catchError(this.handleError<any>('updatePerson', validationErrorHandler))
    );
  }

  deletePerson(person: Person | number, validationErrorHandler: ValidationErrorHandler): Observable<Person> {
    const id = typeof person === 'number' ? person : person.id;
    const url = `${this.personsUrl}/${id}`;

    return this.http.delete<Person>(url, httpOptions).pipe(
      catchError(this.handleError<Person>('deletePerson', validationErrorHandler))
    );
  }

  searchPersons(term: string, validationErrorHandler: ValidationErrorHandler): Observable<Person[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    // https://github.com/jeroenheijmans/sample-auth0-angular-oauth2-oidc/blob/master/DemoApp/src/app/app.module.ts
    console.log('hello: ' + this.oauthService.getIdToken());

    // return this.http.get<Contact[]>(`/api/secure`, {headers: headers}).pipe(
    //   tap(_ => this.log(`found contracts matching "${term}"`)),
    //   catchError(this.handleError<Contact[]>('searchContract', []))
    // );

    return this.http.get<Person[]>(`${this.personsUrl}/?nameLine=${term}`, this.getOptions()).pipe(
      catchError(this.handleError<Person[]>('searchPersons', validationErrorHandler))
    );
  }

  getOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + this.oauthService.getAccessToken()
      })
    };
    // return new HttpHeaders({
    //   "Authorization": "Bearer " + this.oauthService.getAccessToken()
    // });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', validationErrorHandler: ValidationErrorHandler, result?: T) {
    return (error: any): Observable<T> => {

      if (error instanceof HttpErrorResponse) {
        const httpError: HttpErrorResponse = error as HttpErrorResponse;
        if (httpError.status >= 400 && httpError.status <= 500) {
          if(validationErrorHandler) {
            console.log("handle with validation handler");
            validationErrorHandler.handle("" + httpError.message);
            // return of(result as T);
            return throwError("my error");
          }
        }
      }

      this.messageService.addTechnicalError('HeroService: ' + error.message);

      return of(result as T);
    };
  }
}
