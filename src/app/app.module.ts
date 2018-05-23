import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ContactsComponent} from './contacts/contacts.component';
import {ContactDetailComponent} from './contact-detail/contact-detail.component';
import {MessagesComponent} from './messages/messages.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './in-memory-data.service';
import {ContactSearchComponent} from './contact-search/contact-search.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyNavComponent} from './my-nav/my-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {
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
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import {MyDashboardComponent} from './my-dashboard/my-dashboard.component';
import {MyTableComponent} from './my-table/my-table.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    ContactDetailComponent,
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
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
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
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
