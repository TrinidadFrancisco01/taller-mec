import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './componentes/public/login/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserRole().pipe(
      take(1),
      map(role => {
        if (role === 'admin') {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}