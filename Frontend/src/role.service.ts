// role.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private adminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.adminSubject.asObservable();

  setAdminStatus(isAdmin: boolean) {
    this.adminSubject.next(isAdmin);
  }
}
