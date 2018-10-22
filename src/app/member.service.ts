import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {Member} from "./member";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class MemberService {

  constructor(private http: HttpClient, private oauthService: OAuthService,
              private messageService: MessageService) {

  }

  private memberUrl = '/api/members';
  private membershipTypesUrl = '/api/membership-types';
  private subscriptionPeriodsUrl = '/api/subscription-periods';

  addMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.memberUrl, member, httpOptions).pipe(
      tap((c: Member) => this.log(`added perso w/ id=${c.id}`)),
      catchError(this.handleError<Member>('member'))
    );
  }

  getMembers(): Observable<Member[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Member[]>(this.memberUrl).pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes', []))
    );
  }

  getMember(id: string): Observable<Member> {
    const url = `${this.memberUrl}/${id}`;
    return this.http.get<Member>(url, this.getOptions()).pipe(
      tap(_ => this.log(`fetched member id=${id}`)),
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  getSubscriptionPeriods(): Observable<Member> {
    const url = `${this.subscriptionPeriodsUrl}`;
    return this.http.get<Member>(url, this.getOptions()).pipe(
      tap(_ => this.log(`fetched subscription periods`)),
      catchError(this.handleError<Member>(`getSubscriptionPeriods`))
    );
  }

  updateMember(member: Member): Observable<any> {
    console.log(this.memberUrl + '/' + member.id);
    console.log(JSON.stringify(this.memberUrl));
    return this.http.put(this.memberUrl + '/' + member.id, member, this.getOptions()).pipe(
      tap(_ => this.log(`updated member id=${member.id}`)),
      catchError(this.handleError<any>('updateMember'))
    );
  }

  deleteMember(member: Member | number): Observable<Member> {
    const id = typeof member === 'number' ? member : member.id;
    const url = `${this.memberUrl}/${id}`;

    return this.http.delete<Member>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted member id=${id}`)),
      catchError(this.handleError<Member>('deleteMember'))
    );
  }

  searchMembers(term: string): Observable<Member[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    // https://github.com/jeroenheijmans/sample-auth0-angular-oauth2-oidc/blob/master/DemoApp/src/app/app.module.ts
    console.log('hello: ' + this.oauthService.getIdToken());

    return this.http.get<Member[]>(`${this.memberUrl}/?searchString=${term}`, this.getOptions()).pipe(
      tap(_ => this.log(`found members matching "${term}"`)),
      catchError(this.handleError<Member[]>('searchMembers', []))
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
