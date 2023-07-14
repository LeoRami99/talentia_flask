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
import { SignupAdminComponent } from './pages/signup-admin/signup-admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'signup-admin', component: SignupAdminComponent},
  { path: 'create-course', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: CreateCourseComponent },
  { path: 'edit-courses',canActivate: [authGuard],  data: { expectedRole: 'ADMIN' }, component: EditCoursesComponent},
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard],  data: { expectedRole: 'USER' } },
  { path: 'view-course/:id', canActivate: [authGuard], data: { expectedRole: 'USER' }, component: ViewCourseComponent},
  { path: 'edit-course/:id', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: EditCourseComponent},
  { path: 'take-lesson/:id', canActivate: [authGuard],  data: { expectedRole: 'USER' }, component: TakeCourseComponent},
  { path: 'lesson-preview/lesson/:id_curso/:id_seccion/:id_subseccion', canActivate: [authGuard],  data: { expectedRole: 'USER' }, component: LessonPreviewComponent},
  { path: '', component: HomeComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
