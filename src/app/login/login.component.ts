import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import {Claims} from "./claims";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private oauthService: OAuthService) {
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logoff() {
    this.oauthService.logOut();
  }

  public isLoggedIn() : boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  public get name() {

    var claims = this.oauthService.getIdentityClaims() as Claims;
    if (!claims) return null;
    return claims.given_name;
  }
}
