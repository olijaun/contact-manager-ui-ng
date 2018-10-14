import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ContactsComponent} from './contacts/contacts.component';
import {PersonDetailComponent} from './person-detail/person-detail.component';
import {MessagesComponent} from './messages/messages.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
// import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
// import {InMemoryDataService} from './in-memory-data.service';
import {ContactSearchComponent} from './contact-search/contact-search.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyNavComponent} from './my-nav/my-nav.component';
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
  MatMenuModule, MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MyDashboardComponent} from './my-dashboard/my-dashboard.component';
import {MyTableComponent} from './my-table/my-table.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import { BASE_URL } from './app.tokens';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    PersonDetailComponent,
    MessagesComponent,
    DashboardComponent,
    ContactSearchComponent,
    MyNavComponent,
    MyDashboardComponent,
    MyTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
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
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://localhost:8443/api'],
        sendAccessToken: true
      }
    })
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
