import { Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { TutorComponent } from './categories/tutor/tutor.component';
import { MaidComponent } from './categories/maid/maid.component';
import { RentComponent } from './categories/rent/rent.component';
import { ServiceComponent } from './categories/service/service.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './admin/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tutor', component: TutorComponent },
  { path: 'maid', component: MaidComponent },
  { path: 'rent', component: RentComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'register-provider', component: ProviderRegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] }
];