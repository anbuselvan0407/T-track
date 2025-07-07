import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      };
      console.log('Decoded user:', this.user);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.user = null;
    }
  } else {
    this.user = null;
  }
}

      logout() {
    this.authService.logout();
  }

}
