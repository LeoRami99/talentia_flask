import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CreateCourseComponent } from './pages/create-course/create-course.component';
import { EditCoursesComponent } from './pages/edit-courses/edit-courses.component';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { EditCourseComponent } from './pages/edit-course/edit-course.component';
import { TakeCourseComponent } from './pages/take-course/take-course.component';
import { LessonPreviewComponent } from './pages/lesson-preview/lesson-preview.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'create-course', canActivate: [authGuard], component: CreateCourseComponent },
  { path: 'edit-courses',canActivate: [authGuard], component: EditCoursesComponent},
  { path: 'courses', component: CoursesComponent,
    canActivate: [authGuard]
  },
  { path: 'view-course/:id', canActivate: [authGuard], component: ViewCourseComponent},
  { path: 'edit-course/:id', canActivate: [authGuard], component: EditCourseComponent},
  { path: 'take-lesson/:id', canActivate: [authGuard], component: TakeCourseComponent},
  { path: 'lesson-preview/lesson/:id_curso/:id_seccion/:id_subseccion', canActivate: [authGuard], component: LessonPreviewComponent},
  { path: '', component: HomeComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
