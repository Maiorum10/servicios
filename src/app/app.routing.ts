import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { CorreoComponent } from './correo/correo.component';
import { TurnoComponent } from './turno/turno.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { TurnosComponent } from './turnos/turnos.component';

const routes: Routes =[
    { path: 'navbar',             component: NavbarComponent },
    { path: 'user-profile',     component: ProfileComponent },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'home',          component: CorreoComponent },
    { path: 'tickets',          component: TurnosComponent },
    { path: 'seguimiento',          component: TurnoComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
