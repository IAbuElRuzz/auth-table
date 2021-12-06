import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    private authGuardService: AuthGuardService,
    public router: Router) { }

  ngOnInit() {

  }
  doLogout() {
    this.authGuardService.logoutUser();
    this.router.navigate(['/login']);
  }

}
