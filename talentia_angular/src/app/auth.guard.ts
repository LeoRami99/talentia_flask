// import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Inject } from '@angular/core';
// import { ApiService } from './services/api_service/api.service';
// import { HttpClient } from '@angular/common/http';
// import { RolesService } from './services/roles/roles.service';



import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Inject } from '@angular/core';
import { ApiService } from './services/api_service/api.service';
import { HttpClient } from '@angular/common/http';
import { RolesService } from './services/roles/roles.service';

const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const http = Inject(HttpClient)
  const rolesService = new RolesService();
  const apiService = new ApiService(http);
  // redirect to login page if not logged in and trying to access a restricted route
  if (!apiService.isLoggedIn()) {
    // not logged in so redirect to login page with the return url
    window.location.href = '/login';
    return false;
  }

  const rolEsperado = route.data['expectedRole'];
  // console.log('Rol esperado: ' + rolEsperado);
  const rolActual = rolesService.getRoles();
  // console.log('Rol actual: ' + rolActual);
  if (rolActual === rolEsperado) {
    return true;
  } else {
    window.location.href = '/login';
    return false;
  }
};
export { authGuard };
