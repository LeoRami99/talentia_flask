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
import { EditCoursesComponent } from './pages/edit-courses/edit-courses.component';
import { HomeComponent } from './pages/home/home.component';
import { CardEditComponent } from './components/card-edit/card-edit.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CardPreviewComponent } from './components/card-preview/card-preview.component';
import { ViewCourseComponent } from './pages/view-course/view-course.component';

// Configuración de socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


// Configuracion de socket.io
const config : SocketIoConfig = {url: 'http://localhost:5000', options: {}};

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
    EditCoursesComponent,
    HomeComponent,
    CardEditComponent,
    CoursesComponent,
    CardPreviewComponent,
    ViewCourseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // T
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
