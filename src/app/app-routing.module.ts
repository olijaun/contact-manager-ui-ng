import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactsComponent} from './contacts/contacts.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PersonDetailComponent} from './person-detail/person-detail.component';
import {MyDashboardComponent} from './my-dashboard/my-dashboard.component';
import {MemberSearchComponent} from "./member-search/member-search.component";
import {MemberDetailComponent} from "./member-detail/member-detail.component";

const routes: Routes = [
  {path: '', redirectTo: '/search', pathMatch: 'full'},
  {path: 'login', component: MyDashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'search', component: MemberSearchComponent},
  {path: 'person-detail/:id', component: PersonDetailComponent},
  {path: 'member-detail/:id', component: MemberDetailComponent},
  {path: 'new', component: PersonDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
