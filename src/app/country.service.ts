import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';
import {OAuthService} from "angular-oauth2-oidc";
import {Countries, CountryCode} from "./countries";
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CountryService {

  constructor(private http: HttpClient, private oauthService: OAuthService,
              private messageService: MessageService) {

  }

  getCountries(): Observable<CountryCode[]> {
    return of(Countries.countries);
  }

}
