import { Routes } from '@angular/router';
import { EmployeComponent } from './components/employe/employe.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ChefComponent } from './components/chef/chef.component';
import { ChefadminComponent } from './components/chefadmin/chefadmin.component';

export const routes: Routes = [
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'employe', component: EmployeComponent },
  { path: 'inscription', component: InscriptionComponent},
  {path: 'chef' , component : ChefComponent},
  {path : 'chefadmin'  ,component :   ChefadminComponent},
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: '**', redirectTo: '/authentication'}
   
];