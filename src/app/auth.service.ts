import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly JWT_TOKEN = 'JWT_Token'
  private readonly Refresh_JWT_TOKEN = 'Refresh_JWT_TOKEN'
  private loggedInUser?: string;
  private isAuhenticatatedSubject = new BehaviorSubject<Boolean>(false);
  private httpClient = inject(HttpClient);
  private httpLink = 'https://api.escuelajs.co/api/v1/auth/login'

  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private _router: Router) { }


  public login(email: string, password: string): Observable<any> {


    let jsonData = JSON.stringify({
      email: email,
      password: password,
    });

    return this.httpClient.post(this.httpLink, jsonData, { headers: this.header, observe: 'response' })
      .pipe(tap(res => this.doLoginUser(email, res.body as LoginCred)))

  }

  private doLoginUser(username: string, responce: LoginCred) {
    this.loggedInUser = username;
    this.storeJWTToken(responce);
    console.log("responce = ", responce)
    this.isAuhenticatatedSubject.next(true);

  }

  private storeJWTToken(token: LoginCred) {
    localStorage.setItem(this.JWT_TOKEN, token.access_token)
    localStorage.setItem(this.Refresh_JWT_TOKEN, token.refresh_token)
  }

  public logout() {
    localStorage.clear();
    this.isAuhenticatatedSubject.next(false);
    this._router.navigate(['/login'])
  }

  getCurrentUser(): Observable<any> {
    return this.httpClient.get('https://api.escuelajs.co/api/v1/auth/profile')
  }

  // public isLoggedIn() {
  //   return this.isAuhenticatatedSubject.value;
  // }

  public isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpire() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    // if token is not present return true means that its expired.
    if (!token) return true;

    let decodeToken = jwtDecode(token);
    if (!decodeToken.exp) return true;

    const expiredate = decodeToken.exp * 1000;
    const now = new Date().getTime();
    return expiredate < now;
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.Refresh_JWT_TOKEN)
    let jsonData = JSON.stringify({
      refreshToken: refreshToken
    });
    return this.httpClient.post<LoginCred>('https://api.escuelajs.co/api/v1/auth/refresh-token',
      jsonData, { headers: this.header })
      .pipe(tap(res => this.storeJWTToken(res)));
  }
}

export interface LoginCred {
  access_token: string, refresh_token: string
}
