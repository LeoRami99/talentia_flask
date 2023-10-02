import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css'],
})
export class VerifyAccountComponent implements OnInit {
  constructor(
    private routeActive: ActivatedRoute,
    private userData: UserDataService
  ) {}
  boolean_estado = false;
  verificado = false;
  ngOnInit() {
    const token = this.routeActive.snapshot.paramMap.get('token');

    if (token != null && token != undefined && token != '') {
      setTimeout(() => {
        this.userData.verifyAccount({ token: token }).subscribe({
          next: (data) => {
            this.verificado = true;
            this.boolean_estado = true;
          },
          error: (error) => {
            if (error.status == 400) {
              this.boolean_estado = true;
            }
          },
        });
      }, 5000);
    } else {
      this.boolean_estado = true;
    }
  }
}
