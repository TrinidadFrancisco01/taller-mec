import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/public/login/login.component';
import { RegistroComponent } from './componentes/public/registro/registro.component';
import { AgendarCitaComponent } from './componentes/public/agendar-cita/agendar-cita.component';
import { PrincipalComponent } from './componentes/public/principal/principal.component';
import { MapaComponent } from './componentes/public/mapa/mapa.component';
import { ResetPasswordComponent } from './componentes/public/recuperar/recuperar.component';
import { VerifyCodeComponent } from './componentes/public/verificar-codigo/verificar-codigo.component';
import { NewPasswordComponent } from './componentes/public/new-password/new-password.component';
import { PolicyComponent } from './componentes/public/policy/policy.component';
import { TerminosCondicionesComponent } from './componentes/public/terminos-condiciones/terminos-condiciones.component';
import { DisclaimerComponent } from './componentes/public/disclaimer/disclaimer.component';
import { DocumentCrudComponent } from './componentes/admin/document-crud/document-crud.component';
import { AdminPageComponent } from './componentes/admin/admin-page/admin-page.component';
import { AdministrativoComponent } from './componentes/admin/administrativo/administrativo.component';
import { IncidentComponent } from './componentes/admin/incident/incident.component';
import { AdminHeaderComponent } from './componentes/admin/admin-header/admin-header.component';
import { Path } from 'leaflet';
import { Component } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'agendar-cita', component: AgendarCitaComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'recuperar', component: ResetPasswordComponent },
  { path: 'verificar', component: VerifyCodeComponent },
  {path:'nueva_contra',component: NewPasswordComponent},
  {path:'politica',component: PolicyComponent},
  { path: 'terminos' , component: TerminosCondicionesComponent},
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'document-crud', component: DocumentCrudComponent },
  {path : 'crud_empresa' ,component: AdminPageComponent},
  {path : 'administrativo' , component : AdministrativoComponent },
  {path : 'inidencias',  component : IncidentComponent},
  {path: "admin",component: AdminHeaderComponent},

  { path: 'admin', redirectTo: '/principal', pathMatch: 'full' },
  { path: '**', redirectTo: '/principal' }
];
