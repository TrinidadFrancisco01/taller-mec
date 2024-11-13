import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  headerType = signal<string>('default');

  setHeaderType(type: string) {
    this.headerType.set(type);
  }

  getHeaderType() {
    return this.headerType();
  }
}