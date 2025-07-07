import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  hide = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required], // ✅ fixed
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value); // ✅ Check console what you send
      this.authService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Signup successful!';
          this.errorMessage = '';
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.error.error || 'Signup failed.';
          this.successMessage = '';
        }
      });
    }
  }
}
