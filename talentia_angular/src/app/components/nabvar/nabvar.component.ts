import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api_service/api.service';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent {
  mostrarContenidoHTML: boolean = false;

  constructor(public auth: ApiService, private router: Router) {
    // Suscríbete a los eventos del router
    this.router.events.subscribe((event:any) => {
      if (event.routerEvent.urlAfterRedirects === '/login' || event.routerEvent.urlAfterRedirects === '/signup') {
        this.mostrarContenidoHTML = true;
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
