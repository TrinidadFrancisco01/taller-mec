import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AgendarCitaComponent } from './componentes/agendar-cita/agendar-cita.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { MapaComponent } from './componentes/mapa/mapa.component';
import { ResetPasswordComponent } from './componentes/recuperar/recuperar.component';
import { VerifyCodeComponent } from './componentes/verificar-codigo/verificar-codigo.component';
import { NewPasswordComponent } from './componentes/new-password/new-password.component';
import { PolicyComponent } from './componentes/policy/policy.component';
import { TerminosCondicionesComponent } from './componentes/terminos-condiciones/terminos-condiciones.component';
import { DisclaimerComponent } from './componentes/disclaimer/disclaimer.component';
import { DocumentCrudComponent } from './componentes/document-crud/document-crud.component';
import { AdminPageComponent } from './componentes/admin-page/admin-page.component';
import { AdministrativoComponent } from './componentes/administrativo/administrativo.component';
import { IncidentComponent } from './componentes/incident/incident.component';
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

  { path: '', redirectTo: '/principal', pathMatch: 'full' },
  { path: '**', redirectTo: '/principal' }
];
