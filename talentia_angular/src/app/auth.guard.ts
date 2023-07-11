import { CanActivateFn } from '@angular/router';
import { Inject } from '@angular/core';
import { ApiService } from './services/api_service/api.service';
import { HttpClient } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
    const http = Inject(HttpClient)
    const apiService = new ApiService(http);
    // redirect to login page if not logged in and trying to access a restricted route
    if (!apiService.isLoggedIn()) {
        window.location.href = '/login';
        return false;
    }
    return apiService.isLoggedIn();
};
