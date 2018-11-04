import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Person} from './person';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class PersonService {

  constructor(private http: HttpClient, private oauthService: OAuthService,
              private messageService: MessageService) {

  }

  private personsUrl = '/api/persons';

  addPerson(contact: Person): Observable<Person> {
    return this.http.post<Person>(this.personsUrl, contact, httpOptions).pipe(
      tap((c: Person) => this.log(`added perso w/ id=${c.id}`)),
      catchError(this.handleError<Person>('person'))
    );
  }

  getPersons(): Observable<Person[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Person[]>(this.personsUrl).pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes', []))
    );
  }

  getPerson(id: string): Observable<Person> {
    const url = `${this.personsUrl}/${id}`;
    return this.http.get<Person>(url, this.getOptions()).pipe(
      tap(_ => this.log(`fetched contact id=${id}`)),
      catchError(this.handleError<Person>(`getContact id=${id}`))
    );
  }

  updatePerson(person: Person): Observable<any> {
    console.log(this.personsUrl + '/' + person.id);
    console.log(JSON.stringify(this.personsUrl));
    return this.http.put(this.personsUrl + '/' + person.id, person, this.getOptions()).pipe(
      tap(_ => this.log(`updated contact id=${person.id}`)),
      catchError(this.handleError<any>('updatePerson'))
    );
  }

  deletePerson(person: Person | number): Observable<Person> {
    const id = typeof person === 'number' ? person : person.id;
    const url = `${this.personsUrl}/${id}`;

    return this.http.delete<Person>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted contact id=${id}`)),
      catchError(this.handleError<Person>('deletePerson'))
    );
  }

  searchPersons(term: string): Observable<Person[]> {
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
      tap(_ => this.log(`found persons matching "${term}"`)),
      catchError(this.handleError<Person[]>('searchContract', []))
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
