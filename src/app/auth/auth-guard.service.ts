import { Injectable } from '@angular/core';
import { BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() { }



  get isLoggedIn() {
    const token = localStorage.getItem('AppTestToken');
    if (token) {
      this.loggedInSubject.next(true);
    }
    return this.loggedInSubject.asObservable();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('AppTestToken');
    if (token) {
      return true;
    }
    return false;
  }

  saveFakeToken(): void {
    const fakeToken = (Date.now().toString(32) + Math.random().toString(32).substring(2, 16)).toUpperCase();
    const jsonData = JSON.stringify(fakeToken);
    localStorage.setItem('AppTestToken', jsonData);
    this.loggedInSubject.next(true);
  }

  logoutUser(): void {
    localStorage.removeItem('AppTestToken');
    this.loggedInSubject.next(null);
  }
}
