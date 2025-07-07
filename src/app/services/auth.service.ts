import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  constructor(private http: HttpClient,private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }


    logout() {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

    getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }


  getUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.role || null;
  } catch (error) {
    return null;
  }
}

}
