import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {Member, Members, Subscription, SubscriptionPeriod, SubscriptionPeriods, SubscriptionTypes} from "./member";
import {DefaultServiceErrorHandler} from "./default-service-error-handler";
import {MemberSearchCriteria} from "./member-search/MemberSearchCriteria";

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

  getMembers(): Observable<Members> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Members>(this.memberUrl).pipe(
      catchError(this.handleError<Members>('getMembers', new Members()))
    );
  }

  getMember(id: string): Observable<Member> {
    const url = `${this.memberUrl}/${id}`;
    return this.http.get<Member>(url, this.getOptions()).pipe(
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  getSubscriptionTypes(subscriptionPeriodId: string): Observable<SubscriptionTypes> {
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
      catchError(this.handleError<any>('updateMember')),
      tap(p => this.messageService.addInfo("member-detail.member-saved", { 'value': member.id }))
    );
  }

  deleteSubscription(member: Member, subscription: Subscription): Observable<any> {
    const id = subscription.id;
    const memberId = member.id;
    const url = `${this.memberUrl}/${memberId}/subscriptions/${id}`;

    return this.http.delete(url, this.getOptions()).pipe(
      catchError(this.handleError('deleteSubscription')),
      tap(p => this.messageService.addInfo("member-detail.subscription-deleted", { 'value': subscription.id }))
    );
  }

  searchMembers(searchCriteria: MemberSearchCriteria): Observable<Members> {
    // if (!searchCriteria.searchString.trim() && !searchCriteria.periodId.trim()) {
    //   // if not search term, return empty hero array.
    //   return of([]);
    // }

    // https://github.com/jeroenheijmans/sample-auth0-angular-oauth2-oidc/blob/master/DemoApp/src/app/app.module.ts

    return this.http.get<Members>(`${this.memberUrl}/?searchString=${searchCriteria.searchString}&subscriptionPeriodId=${searchCriteria.periodId}&sortBy=${searchCriteria.sortBy}&sortAscending=${searchCriteria.ascending}`, this.getOptions()).pipe(
      catchError(this.handleError<Members>('searchMembers', new Members()))
    );
  }

  exportCsv(searchCriteria: MemberSearchCriteria) : Observable<any> {

    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'text/csv');
    // return this.http.get('/api/persons', { headers: headers, responseType: 'blob' as 'json' });

    var headers = new HttpHeaders({
      'Accept': 'text/csv',
      "Authorization": "Bearer " + this.oauthService.getAccessToken()
    });

    return this.http.get(`${this.memberUrl}/?searchString=${searchCriteria.searchString}&subscriptionPeriodId=${searchCriteria.periodId}&sortBy=${searchCriteria.sortBy}&sortAscending=${searchCriteria.ascending}`, { headers, responseType: "arraybuffer" } ).pipe(
      catchError(this.handleError('download'))
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
