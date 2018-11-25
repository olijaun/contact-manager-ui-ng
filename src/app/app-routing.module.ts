import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PersonDetailComponent} from './person-detail/person-detail.component';
import {LoginComponent} from './login/login.component';
import {MemberSearchComponent} from "./member-search/member-search.component";
import {MemberDetailComponent} from "./member-detail/member-detail.component";
import {WelcomeComponent} from "./welcome/welcome.component";

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  // {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
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
