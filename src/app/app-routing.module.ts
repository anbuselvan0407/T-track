import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { TicketComponent } from './ticket/ticket.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';
import { roleGuard } from './guards/role.guard';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'ticket',
        component: TicketComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'maintainer'] }
      },
      {
        path: 'ticket/:id',
        component: TicketDetailComponent
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'maintainer'] }
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
