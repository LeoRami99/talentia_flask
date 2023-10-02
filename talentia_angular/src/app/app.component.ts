import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar-service.service';
import { ApiService } from './services/api_service/api.service';
import { RolesService } from './services/roles/roles.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  template: `
    <div class="app-container">
      <div class="mdk-drawer js-mdk-drawer" id="default-drawer" id="default-drawer" [attr.data-opened]="sidebarOpened ? '' : null">
        <!-- Contenido del sidebar -->
      </div>
      <!-- Resto del contenido -->
    </div>
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    // ver la url actual
    sidebarOpened = false; // Variable para mantener el estado del sidebar

  constructor(private sidebarService: SidebarService, public auth: ApiService, public rol:RolesService, private route : Router, private routaActiva: ActivatedRoute) {}


  ngOnInit(): void {
    this.sidebarService.sidebarState$.subscribe((isOpened) => {
      this.sidebarOpened = isOpened;
    });
  }
  title = 'talentia_angular';
  isHomeRoute():boolean {
    return this.route.url === '/';
  }

}

