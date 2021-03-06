import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PersonDetailComponent} from './person-detail/person-detail.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MessagesComponent} from './messages/messages.component';
import {AppRoutingModule} from './app-routing.module';
// import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
// import {InMemoryDataService} from './in-memory-data.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from './navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatTabsModule,
  MatMenuModule, MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatAutocompleteModule
} from '@angular/material';
import {LoginComponent} from './login/login.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import { BASE_URL } from './app.tokens';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import { MemberSearchComponent } from './member-search/member-search.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExportComponent } from './export/export.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    PersonDetailComponent,
    MessagesComponent,
    NavigationComponent,
    LoginComponent,
    MemberSearchComponent,
    MemberDetailComponent,
    WelcomeComponent,
    DashboardComponent,
    ExportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // see https://stackoverflow.com/questions/43220348/cant-bind-to-formcontrol-since-it-isnt-a-known-property-of-input-angular
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, {dataEncapsulation: false}
    // ),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule, // TODO: how do I now I have to import that?
    FlexLayoutModule,
    MatOptionModule,
    MatSelectModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://localhost:8443/api'],
        sendAccessToken: true
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    TranslateModule
  ],
  providers: [
    // {provide: AuthConfig, useValue: authConfig },
    { provide: OAuthStorage, useValue: localStorage },
    // { provide: ValidationHandler, useClass: JwksValidationHandler },
    { provide: BASE_URL, useValue: 'https://localhost:8443' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// const myStore: OAuthStorage = {
//   getItem(key) {
//     const data = localStorage.getItem(key);
//     console.warn('get', key, data.substring(0, 25));
//     return data;
//   },
//   setItem(key, data) {
//     console.warn('set', key, data.substring(0, 25));
//     return localStorage.setItem(key,data);
//   },
//   removeItem(key) {
//     console.warn('remove', key);
//     return localStorage.removeItem(key);
//   },
// };
