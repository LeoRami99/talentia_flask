import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NabvarComponent } from './components/nabvar/nabvar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BotonSidebarComponent } from './components/boton-sidebar/boton-sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
// Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './pages/create-course/create-course.component';




@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NabvarComponent,
    SidebarComponent,
    BotonSidebarComponent,
    LoginComponent,
    SignupComponent,
    CreateCourseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // T
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
