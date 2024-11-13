import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderService } from '../../admin/admin-header/header.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/users/login';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.checkAuthStatus();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  setCookieToken(token: string) {
    document.cookie = `token=${token}; path=/;`;
    this.checkAuthStatus();
  }

  getCookieToken(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    
    if (parts.length === 2) {
      const token = parts.pop()?.split(';').shift();
      return token || null;
    }
    return null;
  }

  checkAuthStatus() {
    const token = this.getCookieToken();
    if (token) {
      const payload = this.decodeJwt(token);
      this.isAuthenticatedSubject.next(true);
      this.userRoleSubject.next(payload.role);
      
      if (payload.role === 'admin') {
        this.headerService.setHeaderType('admin');
      } else {
        this.headerService.setHeaderType('default');
      }
    } else {
      this.isAuthenticatedSubject.next(false);
      this.userRoleSubject.next(null);
      this.headerService.setHeaderType('default');
    }
  }

  logout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.headerService.setHeaderType('default');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  }
}