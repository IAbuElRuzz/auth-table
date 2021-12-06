import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  hasSubmitted = false;
  isLoggedIn$: Observable<boolean>;

  userLoginData: User = {
    username: 'John',
    password: 'jKiLrD958'
  };

  validationMessages = {
    username: [],
    password: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authGuardService: AuthGuardService
  ) { }

  ngOnInit() {

    if (this.authGuardService.isAuthenticated) {
       this.router.navigate(['/home']);
    }
    this.setForm();
    this.setValidationErrors();


  }




  private setForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, this.validateUsername.bind(this)]],
      password: ['', [Validators.required, this.validatePassword.bind(this)]]
    });
  }
  private setValidationErrors(): void {

    this.validationMessages = {
      username: [
        {
          type: 'required',
          message: 'Username Required'
        },
        {
          type: 'invalid',
          message: 'Invalid Username'
        },
      ],
      password: [
        {
          type: 'required',
          message: 'Password Required'
        },
        {
          type: 'invalid',
          message: 'Invalid Password'
        },
      ],
    };
  }

  checkLogin(): Observable<boolean> {
    return this.authGuardService.isLoggedIn.pipe(map(x => {
      if (x) {
        return true;
      } else {
        return false;
      }
    }));
  }

  get formControls() {
    return this.loginForm.controls;
  }


  validateUsername(control: AbstractControl): { [key: string]: boolean } {
    if (control.value && control.value !== this.userLoginData.username) {
      return { invalid: true };
    }
    return null;
  }
  validatePassword(control: AbstractControl): { [key: string]: boolean } {
    if (control.value && control.value !== this.userLoginData.password) {
      return { invalid: true };
    }
    return null;
  }

  doLogin() {
    this.authGuardService.saveFakeToken();
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.hasSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.isLoading = true;
      // console.log('this.loginForm.valid ??', this.loginForm.valid);
      this.doLogin();
    }
  }

}

