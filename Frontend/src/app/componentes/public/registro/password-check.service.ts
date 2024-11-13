import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class PasswordCheckService {
  private apiUrl = 'https://api.pwnedpasswords.com/range/';

  constructor(private http: HttpClient) {}

  checkPassword(password: string): Observable<boolean> {
    const hashedPassword = CryptoJS.SHA1(password).toString().toUpperCase();
    const prefix = hashedPassword.substr(0, 5);
    const suffix = hashedPassword.substr(5);

    return this.http.get(this.apiUrl + prefix, { responseType: 'text' }).pipe(
      map(response => {
        const hashes = response.split('\n');
        for (const hash of hashes) {
          const [hashSuffix, count] = hash.split(':');
          if (hashSuffix.trim() === suffix) {
            return true; // Password has been pwned
          }
        }
        return false; // Password has not been pwned
      })
    );
  }
}