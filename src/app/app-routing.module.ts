import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactsComponent} from './contacts/contacts.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ContactDetailComponent} from './contact-detail/contact-detail.component';
import {MyDashboardComponent} from './my-dashboard/my-dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'mydashboard', component: MyDashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'detail/:id', component: ContactDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
