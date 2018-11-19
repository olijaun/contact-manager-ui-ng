import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {Member, SubscriptionType, SubscriptionPeriods, SubscriptionTypes, SubscriptionPeriod} from "./member";
import {isNullOrUndefined} from "util";
import {DefaultServiceErrorHandler} from "./default-service-error-handler";

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
      catchError(this.handleError<Member>('member'))
    );
  }

  getMembers(): Observable<Member[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Member[]>(this.memberUrl).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  getMember(id: string): Observable<Member> {
    const url = `${this.memberUrl}/${id}`;
    return this.http.get<Member>(url, this.getOptions()).pipe(
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  getSubscriptionTypes(subscriptionPeriodId : string): Observable<SubscriptionTypes> {
    const url = `${this.subscriptionPeriodsUrl}/` + subscriptionPeriodId + '/types';
    return this.http.get<SubscriptionTypes>(url, this.getOptions()).pipe(
      catchError(this.handleError<SubscriptionTypes>(`getSubscriptionTypes`))
    );
  }

  getSubscriptionPeriods(): Observable<SubscriptionPeriod[]> {
    const url = `${this.subscriptionPeriodsUrl}`;
    return this.http.get<SubscriptionPeriods>(url, this.getOptions()).pipe(
      map(s => s.subscriptionPeriods),
      catchError(this.handleError<SubscriptionPeriod[]>(`getSubscriptionPeriods`, []))
    );
  }

  updateMember(member: Member): Observable<Member> {
    return this.http.put(this.memberUrl + '/' + member.id, member, this.getOptions()).pipe(
      catchError(this.handleError<any>('updateMember'))
    );
  }

  deleteMember(member: Member | number): Observable<Member> {
    const id = typeof member === 'number' ? member : member.id;
    const url = `${this.memberUrl}/${id}`;

    return this.http.delete<Member>(url, httpOptions).pipe(
      catchError(this.handleError<Member>('deleteMember'))
    );
  }

  searchMembers(term: string, subscriptionPeriodId: string): Observable<Member[]> {
    if (!term.trim() && !subscriptionPeriodId.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    // https://github.com/jeroenheijmans/sample-auth0-angular-oauth2-oidc/blob/master/DemoApp/src/app/app.module.ts

    return this.http.get<Member[]>(`${this.memberUrl}/?searchString=${term}&subscriptionPeriodId=${subscriptionPeriodId}`, this.getOptions()).pipe(
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

  private handleError<T>(operation = 'operation', result?: T) {
    return DefaultServiceErrorHandler.handleError(this.messageService, operation, result);
  }
}
