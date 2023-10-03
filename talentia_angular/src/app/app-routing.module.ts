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
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { LessonPreviewComponent } from './pages/lesson-preview/lesson-preview.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { EditExamenesComponent } from './pages/edit-examenes/edit-examenes.component';
import { EditQuizComponent } from './pages/edit-quiz/edit-quiz.component';
import { TakeQuizComponent } from './pages/take-quiz/take-quiz.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CrearEmpresaComponent } from './pages/crear-empresa/crear-empresa.component';
import { SignUpEmpresaComponent} from './pages/sign-up-empresa/sign-up-empresa.component';
import { DashboardEmpresaComponent } from './pages/dashboard-empresa/dashboard-empresa.component';
import { CrearOfertaComponent } from './pages/crear-oferta/crear-oferta.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { authGuard } from './auth.guard';
import { SignupAdminComponent } from './pages/signup-admin/signup-admin.component';
import { VerOfertaComponent } from './pages/ver-oferta/ver-oferta.component';
import { EditOfertaComponent } from './pages/edit-oferta/edit-oferta.component';
import { EditarOfertasComponent } from './pages/editar-ofertas/editar-ofertas.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VerPostulantesComponent } from './pages/ver-postulantes/ver-postulantes.component';
import { VerPerfilComponent } from './pages/ver-perfil/ver-perfil.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup-admin', component: SignupAdminComponent},
  { path: 'signup-empresa', component: SignUpEmpresaComponent},
  { path: 'create-course', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: CreateCourseComponent },
  { path: 'edit-courses',canActivate: [authGuard],  data: { expectedRole: 'ADMIN' }, component: EditCoursesComponent},
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard],  data: { expectedRole: 'USER' } },
  { path: 'view-course/:id', canActivate: [authGuard], data: { expectedRole: 'USER' }, component: ViewCourseComponent},
  { path: 'edit-course/:id', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: EditCourseComponent},
  { path: 'take-lesson/:id', canActivate: [authGuard],  data: { expectedRole: 'USER' }, component: TakeCourseComponent},
  { path: 'lesson-preview/lesson/:id_curso/:id_seccion/:id_subseccion', canActivate: [authGuard],  data: { expectedRole: 'USER' }, component: LessonPreviewComponent},
  { path: 'create-examen', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: CreateQuizComponent, },
  { path: 'examenes', canActivate: [authGuard], data: { expectedRole: 'USER' }, component: ExamenesComponent},
  { path: 'edit-examenes', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: EditExamenesComponent},
  { path: 'edit-examen/:id', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: EditQuizComponent},
  { path: 'take-quiz/:id', canActivate: [authGuard], data: { expectedRole: 'USER' }, component: TakeQuizComponent},
  { path: 'dashboard-home', canActivate: [authGuard], data: { expectedRole: 'USER' }, component: DashboardHomeComponent},
  { path: 'dashboard-admin', canActivate: [authGuard], data: { expectedRole: 'ADMIN' }, component: DashboardAdminComponent},
  { path: 'dashboard-empresa', canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component: DashboardEmpresaComponent},
  { path: 'create-empresa', canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component:CrearEmpresaComponent},
  { path: 'crear-oferta', canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component:CrearOfertaComponent},
  { path: 'ver-oferta/:id',  component:VerOfertaComponent},
  { path: 'editar-oferta/:id', canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component: EditOfertaComponent},
  { path: 'editar-ofertas', canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component:EditarOfertasComponent},
  { path: 'profile', component:ProfileComponent},
  { path: 'ver-postulantes/:id',  canActivate: [authGuard], data: { expectedRole: 'EMPRESA' }, component:VerPostulantesComponent},
  { path: 'ver-perfil/:id', component:VerPerfilComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'verify-code', component: VerifyCodeComponent},
  { path: 'update-password', component: UpdatePasswordComponent},
  { path: 'activar-cuenta/:token', component: VerifyAccountComponent},

  { path: 'ofertas', canActivate: [authGuard], data: { expectedRole: 'USER' }, component:OfertasComponent},
  { path: 'inicio', component: InicioComponent},
  { path: '', component: HomeComponent},
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
