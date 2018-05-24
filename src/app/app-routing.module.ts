import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactsComponent} from './contacts/contacts.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ContactDetailComponent} from './contact-detail/contact-detail.component';
import {MyDashboardComponent} from './my-dashboard/my-dashboard.component';
import {ContactSearchComponent} from './contact-search/contact-search.component';

const routes: Routes = [
  {path: '', redirectTo: '/search', pathMatch: 'full'},
  {path: 'mydashboard', component: MyDashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'search', component: ContactSearchComponent},
  {path: 'detail/:id', component: ContactDetailComponent},
  {path: 'new', component: ContactDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
