import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Person} from './person';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {DefaultServiceErrorHandler} from "./default-service-error-handler";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class PersonService {

  constructor(private http: HttpClient, private oauthService: OAuthService,
              private messageService: MessageService) {

  }

  private personIdRequestsUrl = '/api/person-id-requests';
  private personsUrl = '/api/persons';

  addPerson(contact: Person): Observable<Person> {
    return this.http.post<Person>(this.personsUrl, contact, httpOptions).pipe(
      catchError(this.handleError<Person>('person'))
    );
  }

  getPersons(): Observable<Person[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Person[]>(this.personsUrl).pipe(
      catchError(this.handleError('getHeroes', null))
    );
  }

  getPerson(id: string): Observable<Person> {
    const url = `${this.personsUrl}/${id}`;
    return this.http.get<Person>(url, this.getOptions()).pipe(
      catchError(this.handleError<Person>(`getContact id=${id}`))
    );
  }

  registerPersonId(id: string): Observable<string> {
    const url = `${this.personIdRequestsUrl}/${id}`;
    return this.http.put(url, "", this.getTextOptions()).pipe(
      catchError(this.handleError<string>(`person-id-request/${id}`)),
      tap(r => console.log("resulllllllt: " + r))
    );
  }

  updatePerson(person: Person, personIdRequestId: string): Observable<any> {
    console.log("updatePerson");
    return this.http.put(this.personsUrl + '/' + person.id, person, {...this.getOptionsWithRequestId(personIdRequestId), responseType: 'text'}).pipe(
      catchError(this.handleError<any>('updatePerson')),
      tap(p => this.messageService.addInfo("successfully saved person: " + person.id))
    );
  }

  deletePerson(person: Person | number): Observable<Person> {
    const id = typeof person === 'number' ? person : person.id;
    const url = `${this.personsUrl}/${id}`;

    return this.http.delete<Person>(url, httpOptions).pipe(
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
      catchError(this.handleError<Person[]>('searchPersons'))
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

  getOptionsWithRequestId(personIdRequestId: string) {
    return {
      headers: new HttpHeaders({
        'person-id-request-id': "" + personIdRequestId,
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + this.oauthService.getAccessToken()
      })
    };
    // return new HttpHeaders({
    //   "Authorization": "Bearer " + this.oauthService.getAccessToken()
    // });
  }

  getTextOptions() {
    return {

      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        'Accept': "text/plain",
        "Authorization": "Bearer " + this.oauthService.getAccessToken()
      }),
      responseType: "text" as "text"
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
    return DefaultServiceErrorHandler.handleError(this.messageService, operation, result);
  }
}
